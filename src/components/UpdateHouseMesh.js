import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { Box3 , Vector3 } from 'three';
import { timestampToHourFloat } from './Clock';

export const UpdateHouseMesh = ( modelContext ,TextureContext, property) => {

    const meshName =  'house_'+String( property.mesh).padStart(2,'0')
    var meshFound = modelContext[meshName]; 
    if(!meshFound) meshFound = Object.values(modelContext)[0]

    const newMesh = SkeletonUtils.clone( meshFound );

    if(Array.isArray(newMesh.material)){
        newMesh.material= newMesh.material.map( mat =>{
        var newMat =  mat.clone();
        UpdateMap( newMat , property , TextureContext )
        return newMat; 
        })
    }

    return newMesh

    
}

export  const UpdateMap = (_mat , property , TextureContext ) =>{

  var section = _mat.name.replace('_mat','');

  var folderName = section;
  //WallB is using WallA folder as a texture source
  if( folderName[folderName.length-1] === "B"){
    folderName= folderName.replace('B','A');
  }
  var texturefullName; 
  if(section in property){
    texturefullName = folderName + '/'+ property[section]
  }
  else{
    texturefullName = folderName + '/1'
  }
  _mat.uniforms.uMap.value =TextureContext[texturefullName];
  if( TextureContext['env/skyColormap']){
    _mat.uniforms.uSkyColorMap.value = TextureContext['env/skyColormap'];
  }
}



export const getMeshHeight = (mesh)=>{
    if(!mesh) return 0; 

    const bbox = new Box3().setFromObject(mesh);
    const size = new Vector3();
    bbox.getSize(size);

    return size.y ;
}



export const updateUtimes = (material , timestamp  , timezone )=> {
  const time =  timestampToHourFloat( timestamp, timezone );

  if( Array.isArray(material) ){
    material.forEach( _mat=>{
      _mat.uniforms.uTime.value= time;
    })
  }else{
    material.uniforms.uTime.value= time;
  }
}