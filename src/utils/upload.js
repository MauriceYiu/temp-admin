import {getToken, setToken, removeToken} from '@/utils/auth'

let OSS = require('ali-oss');
let client = new OSS({
  region: 'oss-cn-hangzhou',
  //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  accessKeyId: 'LTAI2aZGiXyhZzHB',
  accessKeySecret: 'juyUQVR9w9kUuSDcXzYRZWPgpa3Bx4',
  bucket: 'wukong-files'
});

export function upload(fileName, file, cb) {
  client.put("web/" + fileName, file).then((result) => {
    // console.log(result);
    cb(true, result);
  }).catch(function (err) {
    // console.log(err);
    cb(false, "上传附件失败");
  });
}
