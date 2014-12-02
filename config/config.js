module.exports = {
  app: {
    host: '0.0.0.0',
    http: 3000,
    https: 3443
  },
  rest:{
    path:'/ws3/',
    max_callers: 1000
  },
  logger: {
    levels: {
      default: 'DEBUG'
    },
    appenders: [
      {
        category: '[all]',
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: '%d{yyyy-MM-ddThh:mm:ssO}|%[%p%]|%m'
        }
      }
    ],
    replaceConsole: false
  },
  database_policy: {
    retry: 0
  },
  databases: {
    test: {
      host: 'localhost',
      port: 27017,
      database: 'test',
      user: '',
      password: ''
    }
  },
  collections:{
   languages:'languages'
  }
};
