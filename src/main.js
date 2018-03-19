jQuery( document ).ready( function( $ ) {
	$.get( '/api/config', function( data ) {
		config = JSON.parse( data );
		$( '#root').val( config.root );
		$( '#timeZone' ).val( config.timeZone ).dropdown( );
		$( '#dbDump').val( config.DB.dumpTime );
		$( '#siteAdmin').val( config.HTTP.admin );
		$( '#smtpHost').val( config.SMTP.host );
		$( '#smtpFrom').val( config.SMTP.from );
		$( '#taskName').val( config.ScheduledTask.name );
		$( '#httpCheck' ).attr( 'onclick', 'httpCheck( event )' );
		$( '#dbCheck' ).attr( 'onclick', 'dbCheck( event )' );
		$( '#smtpCheck' ).attr( 'onclick', 'smtpCheck( event )' );
		$( '#taskCheck' ).attr( 'onclick', 'taskCheck( event )' );
		$( '#saveIni' ).attr( 'onclick', 'saveIni( event )' );
		$( '#stopServer' ).attr( 'onclick', 'stopServer( event )' );
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

function httpCheck( event ) {
	doCheck( event, '/api/check', { host : 'localhost', port : config.HTTP.port }, { 0: 'positive', 1: 'negative' }, { 0: 'check', 1: 'times' } );
}
function dbCheck( event ) {
	doCheck( event, '/api/check', { host : 'localhost', port : config.DB.port }, { 0: 'positive', 1: 'negative' }, { 0: 'check', 1: 'times' } );
}
function smtpCheck( event ) {
	doCheck( event, '/api/check', { host : $( '#smtpHost' ).val( ), port : '25' }, { 0: 'yellow', 1: 'positive' }, { 0: 'times', 1: 'check' } );
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
	$( '#httpCheck' ).click( );
	$( '#dbCheck' ).click( );
	$( '#smtpCheck' ).click( );
	$( '#taskCheck' ).click( );
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
