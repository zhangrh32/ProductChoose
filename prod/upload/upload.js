
accessid = ''
accesskey = ''
host = ''
policyBase64 = ''
signature = ''
callbackbody = ''
filename = ''
key = ''
expire = 0
g_object_name = ''
g_object_name_type = ''
now = timestamp = Date.parse(new Date()) / 1000; 

function send_request()
{
    var xmlhttp = null;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  
    if (xmlhttp!=null)
    {
        serverUrl = 'http://apipc.8photo.cn/v1/files/uploads';
        xmlhttp.open( "POST", serverUrl, false );
        xmlhttp.send( null );
        return xmlhttp.responseText
    }
    else
    {
        alert("Your browser does not support XMLHTTP.");
    }
};

function check_object_radio() {
    var tt = document.getElementsByName('myradio');
    for (var i = 0; i < tt.length ; i++ )
    {
        if(tt[i].checked)
        {
            g_object_name_type = tt[i].value;
            break;
        }
    }
}

function get_signature()
{
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000; 
    if (expire < now + 3)
    {
        body = send_request()
        var obj = eval ("(" + body + ")");
        host = obj['host']
        policyBase64 = obj['policy']
        accessid = obj['accessid']
        signature = obj['signature']
        expire = parseInt(obj['expire'])
        callbackbody = obj['callback'] 
        key = obj['dir']
        return true;
    }
    return false;
};

function random_string(len) {
　　len = len || 32;
　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz1234567890';
　　var maxPos = chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
    　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function get_suffix(filename) {
    pos = filename.lastIndexOf('.')
    suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

function calculate_object_name(filename)
{
    //if (g_object_name_type == 'local_name')
    //{
    //    g_object_name += "${filename}"
    //}
    //else if (g_object_name_type == 'random_name')
    //{
    //    suffix = get_suffix(filename)
        g_object_name = key + random_string(16) + '_'+ filename
    //}
    return ''
}

function get_uploaded_object_name(filename)
{
    if (g_object_name_type == 'local_name')
    {
        tmp_name = g_object_name
        tmp_name = tmp_name.replace("${filename}", filename);
        return tmp_name
    }
    else if(g_object_name_type == 'random_name')
    {
        return g_object_name
    }
}

function set_upload_param(up, filename, ret)
{
    if (ret == false)
    {
        ret = get_signature()
    }
    g_object_name = key;
    if (filename != '') {
        suffix = get_suffix(filename)
        calculate_object_name(filename)
    }
    new_multipart_params = {
        'key' : g_object_name,
        'policy': policyBase64,
        'OSSAccessKeyId': accessid, 
        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
        'callback' : callbackbody,
        'signature': signature,
    };

    up.setOption({
        'url': host,
        'multipart_params': new_multipart_params
    });

    up.start();
}

var uploader = new plupload.Uploader({
	runtimes : 'html5,flash,silverlight,html4',
	browse_button : 'selectfiles', 
    //multi_selection: false,
	container: document.getElementById('container'),
	flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
	silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
    url : 'http://oss.aliyuncs.com',

    filters: {
        mime_types : [ //只允许上传图片和zip,rar文件
        { title : "Image files", extensions : "jpg,png,jpeg" },
        { title : "Zip files", extensions : "zip,rar" }
        ],
        max_file_size : '20mb', //最大只能上传10mb的文件
        prevent_duplicates : true //不允许选取重复文件
    },

	init: {
		PostInit: function() {
//			document.getElementById('ossfile').innerHTML = '';
			//document.getElementById('postfiles').onclick = function() {
              set_upload_param(uploader, '', false);
            //return false;
			//};
		},

		FilesAdded: function(up, files) {
			plupload.each(files, function(file) {
//				console.log(file);
				var html = '<li id="' + file.id + '"></li>';
                set_upload_param(uploader, '', false);
                $("#katu").prepend(html);
			});
		},
//
		BeforeUpload: function(up, file) {
//          check_object_radio();
            set_upload_param(up, file.name, true);
        },

//		UploadProgress: function(up, file) {
//			var d = document.getElementById(file.id);
//			d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
//          var prog = d.getElementsByTagName('div')[0];
//			var progBar = prog.getElementsByTagName('div')[0]
//			progBar.style.width= 2*file.percent+'px';
//			progBar.setAttribute('aria-valuenow', file.percent);
//		},

		FileUploaded: function(up, file, info) {
            if (info.status == 200)
            {
//              console.log(file);
                var res = JSON.parse(info.response);
//              console.log(res.msg);
                var html = '<img src="'+res.msg+'">' +'<a onclick="del(this)"></a><p><img class="fr" src="/prod/img/shanchu-icon.png" /></p>';
                document.getElementById(file.id).innerHTML = html;
            }
            else
            {
                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
            } 
		},

		Error: function(up, err) {
            if (err.code == -600) {
//              document.getElementById('console').appendChild(document.createTextNode("\n选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小"));
				showMessage("上传的图片太大啦~");
            }
            else if (err.code == -601) {
//              document.getElementById('console').appendChild(document.createTextNode("\n选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型"));
				showMessage("文件类型不符合要求~");
            }
            else if (err.code == -602) {
//              document.getElementById('console').appendChild(document.createTextNode("\n这个文件已经上传过一遍了"));
				showMessage("请勿重复上传~");
            }
            else 
            {
//              document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
            }
		}
	}
});

uploader.init();
