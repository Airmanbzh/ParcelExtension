carriers.add(
	'chronopost', 
	{
		validate : function(id) {
			return id.match(/^[a-z]{2}[0-9]{9}[a-z]{2}$/gi);
		},
		url : function(element) {
			return 'http://www.chronopost.fr/fr/chrono_suivi_search?listeNumerosLT=' + element.id;
		},
		image : 'images/chronopost.png',
		getTracking : function(element, callback)
		{
			var $$ = this;
			
			$.get(
				'http://www.chronopost.fr/tracking-no-drupal/suivi-colis',
				{
					'listeNumerosLT':element.id,
					'langue':'fr',
					'_' : new Date().getTime()
				},
				function(html)
				{
					if (html.tab) {
						html = $(html.tab);
						var subEvent = html.find('table tr:nth-child(2) td:nth-child(2)').text().replace('Chronopost France', '').replace('\t','').replace(/ +(?= )/g,'');
						var subComplement = html.find('table tr:nth-child(2) td:nth-child(3)').text().replace('\t','').replace(/ +(?= )/g,'');
						
						if (element.event !== subEvent || element.complement !== subComplement || element.refresh)
						{
							element.event = subEvent;
							element.complement = subComplement;
							element.refresh = false;
							
							var content = element.event + '\r\n' + element.complement;
							
							element.content = content;
							showTrackingNotification(element);
						}
					}
				},
				"json"
			).always(function() {
				callback(element);
			});
		}
	}
);