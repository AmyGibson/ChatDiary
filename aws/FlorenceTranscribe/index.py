def lambda_handler(event, context):
  print("Received event: " + json.dumps(event, indent=2))
  bucket = event['Records'][0]['s3']['bucket']['name']
  region = event['Records'][0]['awsRegion']
  key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
  runTranscribeJob(region, bucket, key)

def runTranscribeJob(region, bucket, key):
  s3Uri="https://s3-%s.amazonaws.com/%s/%s" % (region, bucket, key)
  print(s3Uri)
  jobName = "florence-%s" % (''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(6)))
  fileName, ext = os.path.splitext(key)
  head, fileName = os.path.split(fileName)
  """print("key "+ key)
  jobName = "-%s" % (''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(6)))
  jobName = fileName + jobName"""
  jobName = jobName+"-"+fileName
  
  #jobName = "alorence-%s" % (''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(6)))
  print("jobName "+ jobName)
  response = client.start_transcription_job(
      TranscriptionJobName=jobName,
      LanguageCode='en-AU',
      MediaFormat='mp3',
      Media={
          'MediaFileUri': s3Uri
      },
      OutputBucketName=os.environ['TargetBucketName'],
      Settings={
          'ShowSpeakerLabels': True,
          'MaxSpeakerLabels': 3,
          'ChannelIdentification': False
      }
  )
  pprint.pprint(response)