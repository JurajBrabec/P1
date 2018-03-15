jQuery( document ).ready( function( $ ) {
	$.get( '/api/root', function( data ) { $( '#root' ).val( data ); } );
	$( 'div.ui.labeled.input' ).addClass( 'small fluid' );
	$( 'div.ui.labeled.input button' ).addClass( 'small secondary' );
//	$( 'div.ui.buttons' ).addClass( 'small' );
	$( '#timeZone' ).dropdown( );	
	$( '#httpCheck' ).attr( 'onclick', 'httpCheck( event )' );
	$( '#dbCheck' ).attr( 'onclick', 'dbCheck( event )' );
	$( '#smtpCheck' ).attr( 'onclick', 'smtpCheck( event )' );
	$( '#taskCheck' ).attr( 'onclick', 'taskCheck( event )' );
	$( '#saveIni' ).attr( 'onclick', 'saveIni( event )' );
	$( '#stopServer' ).attr( 'onclick', 'stopServer( event )' );
} );

function doCheck( event, url, data, classes, icons ) {
	event.preventDefault( );
	$( event.target )
		.removeClass( 'negative positive' )
		.addClass( 'secondary loading' );
	$.get( { 
		url: url,
		data:data,
		cache: false 
	} ).then( function( data ) {
		$( event.target )
			.removeClass( 'secondary loading' )
//			.addClass( data == expect ? 'positive' : 'negative'  )
//			.find( 'i' ).removeClass( 'question thumbs up exclamation' ).addClass( data == expect ? 'thumbs up' : 'exclamation' );
			.addClass( classes[ data ] )
			.find( 'i' ).attr( 'class', 'icon ' + icons[ data ] );
	} );
}

function httpCheck( event ) {
	doCheck( event, '/api/check', { host : 'localhost', port : $( '#httpPort' ).val( ) }, { 0: 'positive', 1: 'negative' }, { 0: 'thumbs up', 1: 'exclamation' } );
}
function dbCheck( event ) {
	doCheck( event, '/api/check', { host : $( '#dbHost' ).val( ), port : $( '#dbPort' ).val( ) }, { 0: 'positive', 1: 'negative' }, { 0: 'thumbs up', 1: 'exclamation' } );
}
function smtpCheck( event ) {
	doCheck( event, '/api/check', { host : $( '#smtpHost' ).val( ), port : '25' }, { 0: 'negative', 1: 'positive' }, { 0: 'exclamation', 1: 'thumbs up' } );
}

function taskCheck( event ) {
	doCheck( event, '/api/task/query', { task : $( '#taskName' ).val( ) }, { 0: 'positive', 1: 'negative' }, { 0: 'exclamation', 1: 'thumbs up' } );
}

function taskCreate( event ) {
	doCheck( event, '/api/task/create', { task : $( '#taskName' ).val( ) }, { 0: 'positive', 1: 'negative' }, { 0: 'exclamation', 1: 'thumbs up' } );
}

function taskDelete( event ) {
	doCheck( event, '/api/task/delete', { task : $( '#taskName' ).val( ) }, { 0: 'positive', 1: 'negative' }, { 0: 'exclamation', 1: 'thumbs up' } );
}

function saveIni( event ) {
	event.preventDefault( );
	$( '#httpCheck' ).click( );
	$( '#dbCheck' ).click( );
	$( '#smtpCheck' ).click( );
	$( '#taskCheck' ).click( );
	return;
	var ini = {
		SITE_NAME: $( '#siteName' ).val ( ),
		TIME_ZONE: $( '#timeZone' ).val ( )
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
