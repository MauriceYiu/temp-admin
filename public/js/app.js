let hostname = window.location.hostname;
switch (hostname) {
    case 'localhost':
        window.API_BASE_URI = 'https://staging-api.yrcs.top';
        window.API_BASE_URI_FOR_CRM = 'https://staging-crm-api.yrcs.top';
        window.isAes = false;
        window.chatroomAddr = 'https://staging-api.yrcs.top/api/v1/live/chatRoomRequestAddress';
        break;
    case 'admin.yrcs.top':
        window.API_BASE_URI = 'https://new-api.yrcs.top';
        window.API_BASE_URI_FOR_CRM = 'https://crm-api.yrcs.top';
        window.isAes = true;
        window.chatroomAddr = 'https://new-api.yrcs.top/api/v1/live/chatRoomRequestAddress';
        break;
    case 'staging-admin.yrcs.top':
        window.API_BASE_URI = 'https://staging-api.yrcs.top';
        window.API_BASE_URI_FOR_CRM = 'https://staging-crm-api.yrcs.top';
        window.isAes = false;
        window.chatroomAddr = 'https://staging-api.yrcs.top/api/v1/live/chatRoomRequestAddress';
        break;
    default:
        alert('您使用的环境不合法');
        window.close();
        break
}

console.log(window.API_BASE_URI);
document.write("<script type=text/javascript src=" + window.API_BASE_URI + "/api/v1/type/typesJS><\/script>");
