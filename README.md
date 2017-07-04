# companies tree

A barebones Node.js app using [Express 4](http://expressjs.com/).

## Running Locally

Make sure you have [Node.js](http://nodejs.org/)installed.

```sh
$ git clone git@git.heroku.com/ellyson.git # or clone your own fork 
$ cd ellyson
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

To connect DB using a driver via the standard MongoDB URI:
```sh
  mongodb://admin:admin@ds143892.mlab.com:43892/companys
```

Exemple of MongoDB doc:
```sh
{
    "_id": {
        "$oid": "5958cc61376d5a1d482da9f0"
    },
    "companys": [
        {
            "company": "simple company",
            "profit": 10321,
            "childs": [
                {
                    "company": "simple company",
                    "profit": 12312,
                    "childs": [
                        {
                            "company": "simple company",
                            "profit": 123124
                        }
                    ]
                }
            ]
        }
    ]
}
```
