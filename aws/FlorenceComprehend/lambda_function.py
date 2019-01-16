import json
import urllib.parse
import boto3
import os
import time

s3 = boto3.client('s3')

comprehendClient = boto3.client('comprehend')
ddbClient = boto3.client('dynamodb')

def lambda_handler(event, context):
  #print("Received event: " + json.dumps(event, indent=2))

  # Get the object from the event and show its content type
  bucket = event['Records'][0]['s3']['bucket']['name']
  key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
  try:
      response = s3.get_object(Bucket=bucket, Key=key)
      body = response['Body'].read().decode('utf-8')
      responseObj = json.loads(body)
      transcript = responseObj['results']['transcripts'][0]['transcript']
      filename, file_extension = os.path.splitext(key)
      
      tempNameList = filename.split('-')
      
      filename = tempNameList[-1]
      
      print(filename)
      processInput(transcript,filename)
  except Exception as e:
      print(e)
      print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
      raise e
      
def processInput(transcript, key):
  languageCodes = detectDominantLanguage(transcript)
  dominantLanguageCode = languageCodes[0]
  sentiment = detectSentiment(transcript, "en")
  keyPhrases = detectKeyPhrases(transcript, "en")
  updateDynamoDB(transcript, languageCodes, sentiment, keyPhrases,key)

def detectDominantLanguage(inputText):
  response = comprehendClient.detect_dominant_language(
      Text=inputText
  )
  return response["Languages"]
  
def detectSentiment(inputText, languageCode):
  response = comprehendClient.detect_sentiment(
      Text=inputText,
      LanguageCode=languageCode
  )
  return response
  
def detectKeyPhrases(inputText, languageCode):
  response = comprehendClient.detect_key_phrases(
      Text=inputText,
      LanguageCode=languageCode
  )
  return response["KeyPhrases"]

def updateDynamoDB(transcript, languageCodes, sentiment, keyPhrases,key):
  tableName = os.environ['DynamoDBTableName']
  timestamp = str(int(round(time.time() * 1000)))
  print(timestamp)
  ddbClient.put_item(TableName=tableName, Item={'timestamp':{'N':timestamp}, 'transcript':{'S':transcript}, 'languageCodes':{'S':json.dumps(languageCodes)}, 'sentiment':{'S':json.dumps(sentiment)}, 'keyPhrases':{'S':json.dumps(keyPhrases)} , 'filename':{'S':key}})