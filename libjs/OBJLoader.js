/**
 * @author mrdoob / http://mrdoob.com/
 * modified / simplified by Maciej Halber to parse into Mesh structures for Princeton COS 426
 */

var OBJLoader = OBJLoader || function ( manager ) {
    this.manager   = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
} ;

OBJLoader.prototype = {

    load: function ( url, meshLoadCallback ) {

        var scope = this;

        var loader = new THREE.XHRLoader( scope.manager );
        loader.setCrossOrigin( this.crossOrigin );
        loader.load( url, function ( text ) {
            var meshInfo = scope.parse( text ); 
            meshLoadCallback( meshInfo[0], meshInfo[1] ); // vertices, faces
        } );

    },

    parse: function ( text ) {
        var start = new Date().getTime();

        var vertices = [];
        var faces = [];
        function vector ( x, y, z ) {
            return new THREE.Vector3( parseFloat( x ), parseFloat( y ), parseFloat( z ) );
        }

        function parseVertexIndex( index ) {
            index = parseInt( index );
            return index >= 0 ? index - 1 : index + vertices.length;
        }

        // fixes
        text = text.replace( /\\\r?\n/g, '' ); // handles line continuations \

        var lines = text.split( '\n' );

        for ( var i = 0; i < lines.length; ++i ) {

            var line = lines[ i ];
            line = line.trim();

            var tokens = line.split(" ");

            // COMMENTS / EMPTY LINES
            if ( line.length === 0 || line.charAt( 0 ) === '#' ) {
                continue;
            }

            // VERTICES
            else if ( tokens[0] === "v" ) {
                var pos = vector( tokens[ 1 ], tokens[ 2 ], tokens[ 3 ] );
                vertices.push( pos );
            }

            // VERTEX NORMALS
            else if ( tokens[0] === "vn" ) {
                // not supported
            }

            // VERTEX UV COORDS =? ["vt 0.2 0.4 "]
            else if ( tokens[0] === "vt" ) {
                // not supported
            }

            // FACES - > only support standard faces ! ! !
            else if ( tokens[0] === "f" ) {
                var f_ind = [];
                for ( var j = 1 ; j < tokens.length ; ++j ) {
                    f_ind.push( parseInt( tokens[j] ) - 1 );
                }
                faces.push( f_ind );
            }

            // OBJECT CREATION
            else if ( tokens[0] === "o"  ) {
                // nothing to do ( add name ? )
            }
            // GROUP
            else if ( tokens[0] === "g" ) {
                // not supported
            }

            // USE MATERIAL
            else if ( tokens[0] === "usemtl"  ) {
                // not supported
            }

            // MATERIAL SPEC
            else if ( tokens[0] === "mtllib"  ) {
                // not supported
            }

            // SMOOTH SHADING
            else if (tokens[0] === "s"  ) {
                // ignored - we deal with it else where
            }

            // OTHER
            else {
                console.log( "OBJLoader: Unhandled line " + line );
            }
        }
        var end = new Date().getTime();
        var elapsed = end - start;
        // console.log ( "Time to parse OBJ file: " + elapsed + " ms" );
        return [ vertices, faces ];
    }
};

