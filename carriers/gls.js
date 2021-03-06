carriers.add(
	'gls', 
	{
		validate : function(id) {
			return id.match(/^[0-9]{14}$/gi);
		},
		url : function(element) {
			return 'https://gls-group.eu/FR/fr/suivi-colis?match=' + element.id;
		},
		image : 'images/gls.png',
		getTracking : function(element, callback) {
			var $$ = this;
			
			$.get(
				'https://gls-group.eu/app/service/open/rest/FR/fr/rstt001',
				{
					'match':element.id,
					'_' : new Date().getTime()
				},
				function(json)
				{
					var events = json.tuStatus[0].progressBar.evtNos.map(function(e) {return e *1;}),
						evtIndex = events.indexOf(Math.max.apply(null, events)),
						subEvent = json.tuStatus[0].history[evtIndex].evtDscr,
						subComplement = 'Site : ' + json.tuStatus[0].history[evtIndex].address.countryName  + ' (' + json.tuStatus[0].history[evtIndex].address.countryCode + ')';
					
					if (element.event !== subEvent || element.complement !== subComplement || element.refresh) {
						element.event = subEvent;
						element.complement = subComplement;
						element.refresh = false;
						
						var content = element.event + '\r\n' + element.complement;
						
						element.content = content;
						showTrackingNotification(element);
					}
				},
				"json"
			).always(function() {
				callback(element);
			});
		}
	}
);