const joi = require('joi');
const q = require('q');
const axios = require('axios');
const package = require('../../package.json');

const spec = joi.object({
  id: joi.string().required(),
  from: joi.string().isoDate().required(),
  to: joi.string().isoDate().required(),
  index: joi.string().min(1).required(),
  size: joi.string().min(1).required(),
});

function service(data, _rave) {
  axios.post(
    'https://kgelfdz7mf.execute-api.us-east-1.amazonaws.com/staging/sendevent',
    {
      publicKey: _rave.getPublicKey(),
      language: 'NodeJs v3',
      version: package.version,
      title: 'Incoming call',
      message: 'Get-card-transactions',
    },
  );

  var d = q.defer();

  q.fcall(() => {
    const { error, value } = spec.validate(data);
    var params = value;
    return params;
  })
    .then((params) => {
      params.method = 'GET';
      var uri = `v3/virtual-cards/${params.id}/transactions?from=${params.from}&to=${params.to}&index=${params.index}&size=${params.size}`;
      return _rave.request(uri, params);
    })
    .then((response) => {
      // console.log(response.body);
      d.resolve(response.body);
    })
    .catch((err) => {
      d.reject(err);
    });

  return d.promise;
}
service.morxspc = spec;
module.exports = service;
