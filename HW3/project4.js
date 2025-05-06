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


class MeshDrawer
{
	// The constructor is a good place for taking care of the necessary initializations.
	constructor()
	{
		this.prog = InitShaderProgram(meshVS, meshFS)
		this.mvp = gl.getUniformLocation( this.prog, 'mvp' )
		this.vertPos = gl.getAttribLocation( this.prog, 'pos' )
		this.texCoord = gl.getAttribLocation(this.prog, 'texCoord')
		this.useTexture = gl.getUniformLocation(this.prog, 'useTexture')
		this.sampler = gl.getUniformLocation(this.prog, 'sampler')
		this.changeYZ = gl.getUniformLocation(this.prog, "changeYZ")
		this.vertBuffer = gl.createBuffer()
		this.texBuffer = gl.createBuffer()
		this.texture = gl.createTexture() 
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
		gl.useProgram( this.prog )
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertBuffer )
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW )

		gl.bindBuffer( gl.ARRAY_BUFFER, this.texBuffer )
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW )
		this.numTriangles = vertPos.length / 3
	}
	

	// This method is called when the user changes the state of the
	// "Swap Y-Z Axes" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	swapYZ( swap )
	{
		gl.useProgram(this.prog)
		gl.uniform1i(this.changeYZ, swap)
	}
	
	
	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw( trans )
	{
		gl.useProgram( this.prog )

		gl.uniformMatrix4fv( this.mvp, false, trans )

		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertBuffer )
		gl.vertexAttribPointer( this.pos, 3, gl.FLOAT, false, 0, 0 )
		gl.enableVertexAttribArray( this.pos )

		gl.bindBuffer( gl.ARRAY_BUFFER, this.texBuffer )
		gl.vertexAttribPointer( this.texCoord, 2, gl.FLOAT, false, 0, 0 )
		gl.enableVertexAttribArray( this.texCoord )

		gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles)
	}
	



	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture( img )
	{

		gl.useProgram( this.prog )
		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture( gl.TEXTURE_2D, this.texture )
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img )
		gl.generateMipmap( gl.TEXTURE_2D )
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR )
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR )
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT )
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT )
		gl.uniform1i(this.sampler, 0)
		gl.uniform1i(this.useTexture, true)

	}
	



	// This method is called when the user changes the state of the
	// "Show Texture" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	showTexture( show )
	{
		gl.useProgram(this.prog)
		gl.uniform1i(this.useTexture, show)
    }
}


var meshVS = `
	attribute vec3 pos;
	attribute vec2 texCoord; 
	varying vec2 vTexCoord;
	uniform mat4 mvp;
	uniform bool changeYZ;
	void main()
	{
		vec4 vec = vec4(pos, 1.0);
		if(changeYZ)
		{
		vec = vec4(vec.x, vec.z, vec.y, vec.w);
		}
		vTexCoord = texCoord;
		gl_Position = mvp * vec;
	}
`;


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
        	gl_FragColor = vec4(0, 0, 0.5, 1.0);
    	}
	}
`;