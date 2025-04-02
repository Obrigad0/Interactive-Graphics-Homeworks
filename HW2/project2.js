// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The transformation first applies scale, then rotation, and finally translation.
// The given rotation value is in degrees.
function GetTransform( positionX, positionY, rotation, scale )
{
	let rot_rad = rotation * (Math.PI / 180)
	let sin = Math.sin(rot_rad)
	let cos = Math.cos(rot_rad)

	let t_matrix = [
		cos * scale, sin * scale, 0, sin * -scale, cos * scale, 0, positionX, positionY , 1
	]
	
	return t_matrix 
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The arguments are transformation matrices in the same format.
// The returned transformation first applies trans1 and then trans2.
function ApplyTransform( trans1, trans2 )
{
	let final_trans = Array( 0, 0, 0, 0, 0, 0, 0, 0, 0 );
	for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                final_trans[i * 3 + j] += trans1[i * 3 + k] * trans2[k * 3 + j];
            }
        }
    }
	return final_trans
}
