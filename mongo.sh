#!/bin/sh
#
# (c) 2014 starting / restarting and stoping  backend
#

# Source function library.
. /etc/rc.d/init.d/functions

servicename=mongo-fidiliti
BIN_HOME=/root/mongodb/mongodb-linux-x86_64-2.6.3/bin
DB_HOME=/root/mongodb/databases/fidiliti
MONGOCMD=${BIN_HOME}/mongod
CFG_LAUNCHER="--config ${DB_HOME}/mongod.cfg"
cd ${BIN_HOME}
do_start() {
  echo -n $"Starting $servicename: "

  __pids_var_run $servicename
  rc=$?
  if [ $rc -ne 3 ] ; then
  if [ $rc -eq 1 ] ; then
  rm /var/run/$servicename.pid
else
  echo_failure
  echo
  exit 1
  fi
  fi

  # update classpath

 echo $MONGOCMD
 echo $CFG_LAUNCHER
  exec "$MONGOCMD" \
  ${CFG_LAUNCHER} "$@" > mongo-fidiliti-stdout.log 2>&1 &

  echo $! > /var/run/$servicename.pid
  echo_success
  echo
}

do_stop() {
  echo -n $"Stopping $servicename: "
  kill -9 `cat /var/run/$servicename.pid` && echo_success || echo_failure
  rm -f /var/run/$servicename.pid
  echo
}

case "$1" in
start)
do_start
;;
stop)
do_stop
;;
status)
echo -n $servicename ; status -p /var/run/$servicename.pid
;;
restart)
do_stop
do_start
;;
*)
echo "Usage: $0 {start|stop|status|restart}"
exit 1
esac


