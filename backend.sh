#!/bin/sh
#
# (c) 2014 starting / restarting and stoping  backend
#

# Source function library.
. /etc/rc.d/init.d/functions

servicename=backend
BIN_HOME=/usr/bin
BACKEND_HOME=/root/backend
NODECMD=${BIN_HOME}/node
BACKEND_LAUNCHER=cluster.js
cd ${BACKEND_HOME}
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


  exec "$NODECMD" \
  ${BACKEND_LAUNCHER} "$@" > backend-stdout.log 2>&1 &

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


