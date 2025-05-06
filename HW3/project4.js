// This function takes the projection matrix, the translation, and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// The given projection matrix is also a 4x4 matrix stored as an array in column-major order.
// You can use the MatrixMult function defined in project4.html to multiply two 4x4 matrices in the same format.
function GetModelViewProjection( projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY )
{
	// [TO-DO] Modify the code below to form the transformation matrix.
	var trans = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];

	let x_cos = Math.cos(rotationX)
	let x_sin = Math.sin(rotationX)
	let y_cos = Math.cos(rotationY)
	let y_sin = Math.sin(rotationY) 

	// first basic rotation on x axis
	let x_rotation = 

	[ 1, 0 , 0 , 0 ,
	  0 , x_cos, x_sin, 0,
	  0, -x_sin, x_cos, 0,
	  0, 0, 0, 1
	] 

	// second basic rotation on y axis
	let y_rotation = 

	[   y_cos, 0 , -y_sin , 0 ,
		0 , 1, 0, 0,
		y_sin, 0, y_cos, 0,
		0, 0, 0, 1
	] 

    let mat = MatrixMult(y_rotation, x_rotation)
	mat = MatrixMult(trans, mat)
	var mvp = MatrixMult( projectionMatrix , mat );
	return mvp;
}


// [TO-DO] Complete the implementation of the following class.

class MeshDrawer
{
	// The constructor is a good place for taking care of the necessary initializations.
	constructor()
	{
		this.prog = InitShaderProgram(meshVS, meshFS)
		this.mvp = gl.getUniformLocation( this.prog, 'mvp' )
		this.vertPos = gl.getAttribLocation( this.prog, 'pos' )
		this.texCoord = gl.getAttribLocation(this.prog, 'texCoord');
		this.vertBuffer = gl.createBuffer()
		this.texBuffer = gl.createBuffer()
	}
	


	// This method is called every time the user opens an OBJ file.
	// The arguments of this function is an array of 3D vertex positions
	// and an array of 2D texture coordinates.
	// Every item in these arrays is a floating point value, representing one
	// coordinate of the vertex position or texture coordinate.
	// Every three consecutive elements in the vertPos array forms one vertex
	// position and every three consecutive vertex positions form a triangle.
	// Similarly, every two consecutive elements in the texCoords array
	// form the texture coordinate of a vertex.
	// Note that this method can be called multiple times.
	setMesh( vertPos, texCoords )
	{
		// [TO-DO] Update the contents of the vertex buffer objects.

		this.numTriangles = vertPos.length / 3;
	}
	



	// This method is called when the user changes the state of the
	// "Swap Y-Z Axes" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	swapYZ( swap )
	{
		// [TO-DO] Set the uniform parameter(s) of the vertex shader
	}
	
	
	
	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw( trans )
	{
			gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
	}
	



	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture( img )
	{
		// [TO-DO] Bind the texture

		// You can set the texture image data using the following command.
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img );

		// [TO-DO] Now that we have a texture, it might be a good idea to set
		// some uniform parameter(s) of the fragment shader, so that it uses the texture.
	}
	



	// This method is called when the user changes the state of the
	// "Show Texture" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	showTexture( show )
	{
		// [TO-DO] set the uniform parameter(s) of the fragment shader to specify if it should use the texture.
	}
	
}

// Vertex shader source code
var meshVS = `
	attribute vec3 pos;
	attribute vec2 texCoord; 
	varying vec2 vTexCoord;
	uniform mat4 mvp;
	void main()
	{
		vTexCoord = texCoord;
		gl_Position = mvp * vec4(pos, 1.0);
	}
`;
// Fragment shader source code
var meshFS = `
	precision mediump float;
	uniform sampler2D sampler;
	uniform bool useTexture;
	varying vec2 vTexCoord;
	void main()
	{
		 if (useTexture) {
        	gl_FragColor = texture2D(sampler, vTexCoord);
    	} else {
        	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    	}
	}
`;