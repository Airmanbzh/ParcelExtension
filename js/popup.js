$(document).ready(function() {
	$('#addTrackingForm').submit(formSubmit);
	
	reloadTracking();
	chrome.storage.onChanged.addListener(reloadTracking);
});

var formSubmit = function(e)
{
	console.log('formSubmit');
	var trackingId = $('#trackingId').val();
	if (trackingId !== '')
	{
		chrome.storage.sync.get('datas', function(datas){
			datas = datas.datas || {};
			
			datas.tracks = datas.tracks || [];
			datas.tracks.push({
				"id":trackingId
			});
			chrome.storage.sync.set({datas:datas});
			
			$('#trackingId').val('');
		});
	}
	
	e.stopPropagation();
	return false;
};

var reloadTracking = function()
{
	console.log('reloadTracking');
	var ul = $('#listTracking');
	ul.html('');
	
	chrome.storage.sync.get('datas', function(datas){
		datas = datas.datas || {};
		datas.tracks = datas.tracks || [];
		datas.tracks.forEach(function(element){
			ul.append('<li><a class="trackingId">' + element.id + '<a class="delete"></a></a></li>');
		});
		
		ul.find('li a.trackingId').click(function(){
			var id = $(this).text();
			console.log(id);
			chrome.storage.sync.get('datas', function(datas){
				datas = datas.datas || {};
				datas.tracks = datas.tracks || [];
				datas.tracks.forEach(function(element){
					if (element.id == id)
					{
						element.refresh = true;
					}
				});
				
				chrome.storage.sync.set({datas:datas});
			});
		});
	
		ul.find('li a.delete').click(function(){
			var id = $(this).parent().text();
			chrome.storage.sync.get('datas', function(datas){
				datas = datas.datas || {};
				datas.tracks = datas.tracks || [];
				datas.tracks.forEach(function(element, index){
					if (element.id == id)
					{
						datas.tracks.splice(index, 1);
					}
				});
				
				chrome.storage.sync.set({datas:datas});
			});
		});
	});
};