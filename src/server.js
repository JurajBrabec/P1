var http = require( 'http' );
var url = require( 'url' );
var path = require( 'path' );
var fs = require( 'fs' );
var net = require( 'net' ); 
var proc = require( 'child_process' );
module.paths = [ path.resolve( process.cwd( ), 'bin/nodejs/node_modules' ) ];
var ini = require( 'ini' );
var moment = require( 'moment-timezone' );
var port = 9615;

var mimeTypes = {
	'css': 'text/css',
	'eot': 'application/vnd.ms-fontobject',
	'html': 'text/html',
	'jpg': 'image/jpeg',
	'js': 'text/javascript',
	'otf': 'application/x-font-opentype',
	'png': 'image/png',
	'sfnt': 'application/font-sfnt',
	'svg': 'image/svg+xml',
	'ttf': 'application/x-font=ttf',
	'woff': 'application/font-woff',
	'woff2': 'application/font-woff2'
};

function getParam( req, name ) {
	var result = new RegExp( '[?&]' + name + '(=([^&#]*)|&|#|$)' ).exec( req.url )[ 2 ];
	return decodeURI( result );
}

console.log( 'Starting...');
var config = ini.parse( fs.readFileSync( path.resolve( process.cwd( ), 'config.ini' ), 'utf-8' ) );
config.root = process.cwd( );
config.timeZone = moment.tz.guess( );

var server = http.createServer( function( req, res ) {
	var uri = url.parse( req.url ).pathname;
	if ( uri == '/' ) uri = '/index.html';
	if ( uri == '/index.html' ) uri = '/src/index.html';
	if ( req.method == 'POST' ) {
		var body = '';
		req.on( 'data', function ( data ) { body += data; } );
        req.on( 'end', function ( ) { 
			if ( uri == '/api/save' ) {
				console.log( body );
				res.end( uri );
				return;
			}
			console.log( 'Unknown POST URI: ' + uri );
		} );
		return;
    }
	switch ( uri ) {
		case '/api/config':
			res.writeHead( 200, { 'Content-Type': 'text/plain' } );
			res.end( JSON.stringify( config ) );
			break;
		case '/api/check':
			var checkHost = getParam( req, 'host' );
			var checkPort = getParam( req, 'port' );
			var s = new net.Socket( );
			res.writeHead( 200, { 'Content-Type': 'text/plain' } );
			s.setTimeout( 1500, function( ) { s.destroy( ); res.end( '0' ); } );
			s.on( 'error', function( ) {
				s.destroy( );
				res.end( '0' );
			} );
			s.connect( checkPort, checkHost, function( ) {
				s.destroy( );
				res.end( '1' );
			} );
			break;
		case '/api/service/query':
			var checkTask = getParam( req, 'name' );
			res.writeHead( 200, { 'Content-Type': 'text/plain' } );
			proc.exec( 'sc query "' + checkTask + '"', ( err, stdout, stderr ) => {
				res.end( err == null ? '1' : '0'  );
			} );
			break;
		case '/api/task/query':
			var checkTask = getParam( req, 'task' );
			res.writeHead( 200, { 'Content-Type': 'text/plain' } );
			proc.exec( 'schtasks /query /tn "' + checkTask + '"', ( err, stdout, stderr ) => {
				res.end( err == null ? '1' : '0'  );
			} );
			break;
		case '/api/task/create':
			var checkTask = getParam( req, 'task' );
			res.writeHead( 200, { 'Content-Type': 'text/plain' } );
			proc.exec( 'schtasks /create /tn "' + checkTask + '"', ( err, stdout, stderr ) => {
				res.end( err == null ? '1' : '0'  );
			} );
			break;
		case '/api/task/delete':
			var checkTask = getParam( req, 'task' );
			res.writeHead( 200, { 'Content-Type': 'text/plain' } );
			proc.exec( 'schtasks /delete /tn "' + checkTask + '"', ( err, stdout, stderr ) => {
				res.end( err == null ? '1' : '0'  );
			} );
			break;
		case '/api/stop':
			console.log( 'Closing...' ) ;
			res.writeHead( 200, { 'Content-Type': 'text/plain' } );
			res.end( 'Closed.' );
			req.connection.end( );
			req.connection.destroy;
			server.close( function( ) {
				console.log('Closed.');
				process.exit( );
			} );
			break;
		default:
			var filename = path.join( process.cwd( ), uri );
			fs.exists( filename, function( exists ) {
				if( !exists ) {
					console.log( 'Resource missing: : ' + filename ) ;
					res.writeHead( 200, { 'Content-Type': 'text/plain' } );
					res.write( '404 Not Found\n' );
					res.end( );
					return;
				}
				var mimeType = mimeTypes[ path.extname( filename ).split( '.' )[ 1 ] ];
				res.writeHead( 200, { 'Content-Type': mimeType } );
				var fileStream = fs.createReadStream( filename );
				fileStream.pipe( res );
			} );
	}
} ).listen( port, function( ){
    console.log( 'Listening on port ' + port + '...');
	proc.exec( 'start http://localhost:' + port );
} );
