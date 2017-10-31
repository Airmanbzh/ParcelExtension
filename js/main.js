var defaultCarrierList = {
		'chronopost':{
			path : './carriers/chronopost.js'
		}
	},
	carriers = {
		list:{},
		addCarrier : function(name, path)
		{
			console.log('carriers.addCarrier');
			chrome.storage.sync.get('carriers', function(datas){
				datas = datas.carriers || defaultCarrierList;
				datas[name] = path;
				chrome.storage.sync.set(datas, carriers.load);
			});
		},
		add:function(name, object)
		{
			console.log('carriers.add');
			carriers.list[name] = object;
		},
		load : function(callback)
		{
			console.log('carriers.load');
			chrome.storage.sync.get('carriers', function(datas){
				datas = datas.carriers || defaultCarrierList;
				for(var key in datas){
					if (carriers.list[key] === undefined)
					{
						document.write('<script type="text/javascript" src="' + datas[key] + '"></script>');
					}
				}
				
				if (!!(callback && callback.constructor && callback.call && callback.apply)) {
					callback();
				}
			});
		},
		search : function(id) {
			var key = undefined;
			for (var carrierName in carriers.list) {
				if (carriers.list[carrierName].validate(id)) {
					key = carrierName;
				}
			}
			
			return key;
		}
	};

var notifications = {};
var showTrackingNotification = function(element)
{
	console.log('showTrackingNotification');
	imageUrl = carriers.list[element.carrierName].image || 'images/parcel.png';
	chrome.notifications.create(
		element.id,
		{
			type: "basic",
			title: 'Info tracking',
			message: element.content,
			iconUrl: imageUrl,
			requireInteraction: true,
			buttons: [
				{
					title:'Voir sur le site'
				}
			]
		},
		function(id) {
			notifications[id] = element;
			console.log(notifications);
		}
	);
	
	chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
		if (notificationId === notifications[notificationId].id) {
			if (buttonIndex === 0) {
				chrome.tabs.create({url: carriers.list[notifications[notificationId].carrierName].url(notifications[notificationId])});
			}
			chrome.notifications.clear(notificationId, function(){});
		}
	});
};

var getTracksUpdate = function(onlyUpdate)
{
	console.log('getTracksUpdate');
	var onlyUpdate = onlyUpdate || false;
	chrome.storage.sync.get('datas', function(datas){
		datas = datas.datas || {};
		datas.tracks = datas.tracks || [];
		datas.tracks.forEach(function(element){
			if (element.carrierName === undefined)
			{
				element.carrierName = carriers.search(element.id);
			}
			
			if (element.carrierName !== undefined && (!onlyUpdate || (onlyUpdate && element.refresh)))
			{
				carriers.list[element.carrierName].getTracking(element, function(){
					chrome.storage.sync.set({datas:datas});
				});
			}
		});
	});
};

var getManualTracksUpdate = function()
{
	getTracksUpdate(true);
};

chrome.storage.onChanged.addListener(function(){
	console.log('chrome.storage.onChanged.addListener');
	carriers.load();
	getTracksUpdate();
});

carriers.load(function(){
	carriers.addCarrier('chronopost', './carriers/chronopost.js');
	carriers.addCarrier('laposte', './carriers/laposte.js');
	carriers.addCarrier('gls', './carriers/gls.js');
	var interval = window.setInterval(getTracksUpdate, 60000);
	window.setTimeout(getManualTracksUpdate, 1000);
});