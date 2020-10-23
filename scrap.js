var html_parser = require('node-html-parser');
var axios = require('axios');

module.exports = class scrap{
	

	constructor(){

	}

	async get_metadata_url(url){
		try{
			return await axios.get(url)
		}
		catch(ex){
			console.log('*******************:',ex)
			return ''
		}
	}

	isUrl(s) {
        return s && /((http(s)?):\/\/[\w\.\/\-=?#]+)/i.test(s);
    }

	readAttribute(el, name) {
        var attr = el.getAttribute('name') || el.getAttribute('property');
        return attr == name ? el.getAttribute('content') : null;
    }

    finding_images ($, t) {
        var images = [];
        var _this = this;
        if (t == 'og') {

            $.querySelectorAll('meta').forEach(function (el) {

                var propName = el.getAttribute('property') || el.getAttribute('name');
                var content = el.getAttribute('content');
                if (propName === 'og:image' || propName === 'og:image:url') {
                    images.push(content);
                }
            });
        }
        else {

            $.querySelectorAll('img').forEach(function (el) {

                var src = el.getAttribute('src');

                if (src && _this.isUrl(src)) {                    
                    images.push(src);
                }
            });

        }

        return images;
    }

    finding_vedios($) {
        var videos = [];

        $.querySelectorAll('meta').forEach(function (el) {
            var propName = el.getAttribute('property') || el.getAttribute('name');
            var content = el.getAttribute('content');

            if (propName === 'og:video' || propName === 'og:video:url') {
                videos.push({ url: content });
            }

            var current = videos[videos.length - 1];

            switch (propName) {
                case 'og:video:secure_url':
                    current.secure_url = content;
                    break;
                case 'og:video:type':
                    current.type = content;
                    break;
                case 'og:video:width':
                    current.width = parseInt(content, 10);
                    break;
                case 'og:video:height':
                    current.height = parseInt(content, 10);
                    break;
            }

        });


        return videos;
    }

	async parsing_response_data(url){
		try{
			var _this = this
			var resp = await _this.get_metadata_url(url)
			if(resp == '')
				return {"error":"404"}
			var og = {}, meta = {};
            var $ = html_parser.parse(resp.data);
            og.images = _this.finding_images($, 'og');
            og.videos = _this.finding_vedios($);
        	var metas = $.querySelectorAll('meta');
	    	for (let i = 0; i < metas.length; i++) {
	            var el = metas[i];                      
                let title = _this.readAttribute(el, 'title');
                if(title)
                	meta.title = title
                let description = _this.readAttribute(el, 'description');
                if(description)
                	meta.description = description
                let image = _this.readAttribute(el, 'image');
                if(image)
                	meta.image = image

                let og_title = _this.readAttribute(el, 'og:title');
                if(og_title)
                	og.title = og_title

                let og_description = _this.readAttribute(el, 'og:description');
                if(og_description)
                	og.description = og_description

                let og_image = _this.readAttribute(el, 'og:image');
                if(og_image)
                	og.image = og_image

                let og_url = _this.readAttribute(el, 'og:url');
                if(og_url)
                	og.url = og_url

                let og_site_name = _this.readAttribute(el, 'og:site_name');
                if(og_site_name)
                	og.site_name = og_site_name

                let og_type = _this.readAttribute(el, 'og:type');
                if(og_type)
                	og.type = og_type

	        }
	        meta.images = _this.finding_images($);
	   
	        if(Object.entries(og).length != 0)
	        	meta.og = og
	        console.log('meta_scraping data: ',meta)
	        return meta   
		}
		catch(ex){
			console.log('$$$$$$$$$$$$$$$$$$$$$$$$ ',ex)
			return {"error":"404 error"}
		}
	}

}
// var ob = new Scrap()
// ob.parsing_response_data('https://learnstartup.net/p/BJQWO5_Wnx')