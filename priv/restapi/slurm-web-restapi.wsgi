import logging, sys
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, '../priv/restapi')
from slurmrestapi import app as application
