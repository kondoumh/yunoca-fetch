# yunoca-fetch

Scraping tool for yunoca(Yamaguchi University Academic Repository).

```
$ cp config/default.json config/production.json
```
Edit production.json.

```json
{
    "Issue": {
        "creator": "セイ%2C+メイ"
    },
    "Mail": {
        "from": "from@mail.address",
        "to": "to@mail.address",
        "subject": "yunoca",
        "transport": "your_smtp_transport_setting"
    }
}```

Set target creater name in Japanese katakana divided '%2c+' to ```Issue.creator```.

If you want send data by mail set Mail settings.

```
$ npm install
$ npm start
```

Result file(CSV) will be created.

eg. work/yunoca-YYYYmmddHHmmdd.csv

If you want JSON format

```
$ npm run json
```

If you want HTML format

```
$ npm run html
```

This script send mail with csv format.

```
$ npm run mail
```
