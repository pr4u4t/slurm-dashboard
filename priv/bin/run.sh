#!/bin/bash
cd ../restapi
nohup uwsgi --plugin python --http-socket :2002 --wsgi-file slurm-web-restapi.wsgi&
cd ../webconf-server
nohup uwsgi --plugin python --http-socket :2001 --wsgi-file slurm-web-conf.wsgi&
