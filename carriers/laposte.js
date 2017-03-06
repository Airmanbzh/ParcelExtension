carriers.add(
	'laposte', 
	{
		validate : function(id) {
			return id.match(/^[0-9][a-z][0-9]{11}$/gi);
		},
		url : function(element) {
			return 'http://www.laposte.fr/particulier/outils/suivre-vos-envois?code=' + element.id;
		},
		image : 'images/colissimo.png',
		getTracking : function(element, callback) {
			var $$ = this;
			
			$.get(
				'http://www.laposte.fr/particulier/outils/suivre-vos-envois',
				{
					'code':element.id,
					'_' : new Date().getTime()
				},
				function(html)
				{
					html = $(html);
					var subEvent = html.find('div.results-suivi table tbody tr:nth-child(1) td:nth-child(1)').text().replace('\t','').replace(/ +(?= )/g,'');
					var subComplement = html.find('div.results-suivi table tbody tr:nth-child(1) td:nth-child(2)').text().replace('\t','').replace(/ +(?= )/g,'');
					
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