import CryptoJS from 'crypto-js';

//解密方法
const decryptStr = (data) => {
    let resData = data.split("/");
    let key = resData[0];
    let keyFirstWord = key.substr(0, 1);
    key = key.substr(1);
    key = key.replace(/\d/g, keyFirstWord);

    key = CryptoJS.enc.Latin1.parse(key);
    var decrypted = CryptoJS.AES.decrypt(data.substr(18), key, { iv: key, padding: CryptoJS.pad.ZeroPadding });

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}

export default decryptStr;