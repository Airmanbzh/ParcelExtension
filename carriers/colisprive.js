carriers.add(
	'colisprive', 
	{
		validate : function(id) {
			return id.match(/^[0-9]{17}$/gi);
		},
		url : function(element) {
			return 'https://www.colisprive.com/moncolis/pages/detailColis.aspx?numColis=' + element.id;
		},
		image : 'images/colisprive.png',
		getTracking : function(element, callback) {
			var $$ = this;
			
			$.get(
				'https://www.colisprive.com/moncolis/pages/detailColis.aspx',
				{
					'numColis':element.id,
					'_' : new Date().getTime()
				},
				function(html)
				{
					html = $(html);
					var subEvent = html.find('.tableHistoriqueColis .bandeauText td:nth-child(2)').text().replace('\t','').replace(/ +(?= )/g,'');
					var subComplement = "";
					
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