carriers.add(
	'laposte', 
	{
		validate : function(id) {
			return id.match(/^[0-9]{16}$/gi);
		},
		url : function(element) {
			return 'https://www.tnt.fr/public/suivi_colis/recherche/visubontransport.do?bonTransport=' + element.id;
		},
		image : 'images/tnt.png',
		getTracking : function(element, callback) {
			var $$ = this;
			
			$.get(
				'https://www.tnt.fr/public/suivi_colis/recherche/visubontransport.do',
				{
					'bonTransport':element.id,
					'_' : new Date().getTime()
				},
				function(html)
				{
					html = $(html);
					var subEvent = html.find('div.result__content div.roster.roster-palm:first .roster__item:first').text().trim().replace('\t','').replace(/ +(?= )/g,'');
					var subComplement = html.find('div.result__content div.roster.roster-palm:first .roster__item:nth-child(3)').text().trim().replace('\t','').replace(/ +(?= )/g,'');
					
					if (element.event !== subEvent || element.complement !== subComplement || element.refresh) {
						element.event = subEvent;
						element.complement = subComplement;
						element.refresh = false;
						
						var content = element.event + '\r\n' + element.complement;
						
						element.content = content;
						showTrackingNotification(element);
					}
				}
			).always(function() {
				callback(element);
			});
		}
	}
);