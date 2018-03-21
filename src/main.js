jQuery( document ).ready( function( $ ) {
	$.get( '/api/config', function( data ) {
		config = JSON.parse( data );
		$( '#root').val( config.root );
		$( '#timeZone' ).val( config.timeZone ).dropdown( );
		$( '#dbHost' ).val( config.DB.host );
		$( '#dbPort' ).val( config.DB.port );
		$( '#dbServiceName' ).val( config.DB.service );
		$( '#dbDump' ).val( config.DB.dumpTime );
		$( '#httpServiceName' ).val( config.HTTP.service );
		$( '#siteAdmin' ).val( config.HTTP.admin );
		$( '#smtpHost' ).val( config.SMTP.host );
		$( '#smtpPort' ).val( config.SMTP.port );
		$( '#smtpFrom' ).val( config.SMTP.from );
		$( '#taskName' ).val( config.ScheduledTask.name );
		$( '#httpSSL' ).checkbox( {
			fireOnInit : true,
			onChange: function( ) {
				$( '#httpCheck' )
					.removeClass( 'negative yellow positive' )
					.addClass( 'secondary' )
					.find( 'i' ).attr( 'class', 'question icon' );
			},
			onChecked: function( ) {
				$( '#httpPort' ).val( '443' );
				$( '#httpCheck' ).click( );
			},
			onUnchecked: function( ) {
				$( '#httpPort' ).val( '80' );
				$( '#httpCheck' ).click( );
			}
		} ).checkbox( config.HTTP.SSL == 1 ? 'check' : 'uncheck' );
		$( '#httpServiceCheck' ).attr( 'onclick', 'httpServiceCheck( event )' );
		$( '#dbServiceCheck' ).attr( 'onclick', 'dbServiceCheck( event )' );
		$( '#httpPortCheck' ).attr( 'onclick', 'httpPortCheck( event )' );
		$( '#dbPortCheck' ).attr( 'onclick', 'dbPortCheck( event )' );
		$( '#smtpPortCheck' ).attr( 'onclick', 'smtpPortCheck( event )' );
		$( '#taskCheck' ).attr( 'onclick', 'taskCheck( event )' );
		$( '#saveIni' ).attr( 'onclick', 'saveIni( event )' );
		$( '#stopServer' ).attr( 'onclick', 'stopServer( event )' );
		$( '#saveIni' ).click( );
	} );
} );

function doCheck( event, url, data, classes, icons ) {
	event.preventDefault( );
	$( event.target )
		.removeClass( 'negative yellow positive' )
		.addClass( 'secondary loading' );
	$.get( { 
		url: url,
		data:data,
		cache: false 
	} ).then( function( data ) {
		$( event.target )
			.removeClass( 'secondary loading' )
			.addClass( classes[ data ] )
			.find( 'i' ).attr( 'class', 'icon ' + icons[ data ] );
	} );
}

function httpPortCheck( event ) {
	doCheck( event, '/api/check', { host : 'localhost', port : $( '#httpPort' ).val( ) }, { 0: 'positive', 1: 'negative' }, { 0: 'check', 1: 'times' } );
}
function dbPortCheck( event ) {
	doCheck( event, '/api/check', { host : 'localhost', port : $( '#dbPort' ).val( ) }, { 0: 'positive', 1: 'negative' }, { 0: 'check', 1: 'times' } );
}
function smtpPortCheck( event ) {
	doCheck( event, '/api/check', { host : $( '#smtpHost' ).val( ), port : $( '#smtpPort' ).val( ) }, { 0: 'yellow', 1: 'positive' }, { 0: 'times', 1: 'check' } );
}

function httpServiceCheck( event ) {
	doCheck( event, '/api/service/query', { name : $( '#httpServiceName' ).val( ) }, { 0: 'positive', 1: 'negative' }, { 0: 'check', 1: 'times' } );
}
function dbServiceCheck( event ) {
	doCheck( event, '/api/service/query', { name : $( '#dbServiceName' ).val( ) }, { 0: 'positive', 1: 'negative' }, { 0: 'check', 1: 'times' } );
}

function taskCheck( event ) {
	doCheck( event, '/api/task/query', { task : config.ScheduledTask.name }, { 0: 'positive', 1: 'yellow' }, { 0: 'check', 1: 'info' } );
}

function taskCreate( event ) {
	doCheck( event, '/api/task/create', { task : config.ScheduledTask.name, interval: config.ScheduledTask.interval }, { 0: 'positive', 1: 'negative' }, { 0: 'check', 1: 'times' } );
}

function taskDelete( event ) {
	doCheck( event, '/api/task/delete', { task : config.ScheduledTask.name }, { 0: 'positive', 1: 'negative' }, { 0: 'check', 1: 'times' } );
}

function saveIni( event ) {
	event.preventDefault( );
	$( '#httpPortCheck' ).click( );
	$( '#dbPortCheck' ).click( );
	$( '#smtpPortCheck' ).click( );
	$( '#taskCheck' ).click( );
	$( '#httpServiceCheck' ).click( );
	$( '#dbServiceCheck' ).click( );
	return;
	var ini = {
		SITE_NAME: $( '#siteName' ).val( ),
		TIME_ZONE: $( '#timeZone' ).val( )
	};
	$.post( '/api/save', ini, function( data ) {
		$( event.target )
			.popup( {
				title   : 'Result',
				content : data
			} )
	} );
}
function stopServer( event ) {
	event.preventDefault( );
	$( 'button' ).prop( 'disabled', true );
	$.get( '/api/stop', function( data ) {
		$( event.target ).text( data );
		window.open( '', '_self', '' ).close( );
	} );
}
