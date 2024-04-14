import {
    Viewer,
    Cartesian3,
    Terrain,
    Math,
    createOsmBuildingsAsync,
    Cesium3DTileset,
    Color,
    Ion,
  } from "cesium";
  import "cesium/Build/Cesium/Widgets/widgets.css";
  import "./css/main.css";
  
  // CesiumJS has a default access token built in but it's not meant for active use.
  // please set your own access token can be found at: https://cesium.com/ion/tokens.
  Ion.defaultAccessToken = "";
  
  // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
  const viewer = new Viewer("cesiumContainer", {
    terrain: Terrain.fromWorldTerrain(),
  });
  
  // Add Cesium OSM Buildings, a global 3D buildings layer.
  const denverAerometrexData = await Cesium3DTileset.fromIonAssetId(354307)
  viewer.scene.primitives.add(denverAerometrexData);
  //await viewer.zoomTo(denverAerometrexData)

  const osmBuildingsTileset = await createOsmBuildingsAsync();
  var buildings = viewer.scene.primitives.add(osmBuildingsTileset)

  const apolloPointCloud = await Cesium3DTileset.fromIonAssetId(2537258)
  viewer.scene.primitives.add(apolloPointCloud)
  apolloPointCloud.pointCloudShading.maximumAttenuation = undefined
  apolloPointCloud.pointCloudShading.baseResolution = undefined
  apolloPointCloud.pointCloudShading.geometricErrorScale = 2.0
  apolloPointCloud.pointCloudShading.attenuation = true

  const melbournePointCloud = await Cesium3DTileset.fromIonAssetId(43978)
  viewer.scene.primitives.add(melbournePointCloud)
  melbournePointCloud.pointCloudShading.maximumAttenuation = undefined
  melbournePointCloud.pointCloudShading.baseResolution = undefined
  melbournePointCloud.pointCloudShading.geometricErrorScale = 2.0
  melbournePointCloud.pointCloudShading.attenuation = true

  var osm = document.getElementById("Show OSM Buildings")
  osm.addEventListener('change', (event) => {
    if (osm.checked){
      buildings.show = true;
    } else {
      buildings.show = false;
    }
  })

  var dia = document.getElementById("DIA")
  dia.addEventListener('click', (event) => {
    viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(-104.674525, 39.859614, 30000),
  })})

  var aero = document.getElementById("Aerometrex")
  aero.addEventListener('click', (event) => {
    console.log("clicked")
    buildings.show = false;
    osm.checked = false;
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(-104.9928, 39.7538, 1700),
      orientation: {
        heading: Math.toRadians(-40),
        pitch: Math.toRadians(-15),
        roll: 0.0,
      },
    })
  })

  var apollo = document.getElementById("Apollo")
  apollo.addEventListener('click', (event) => {
    viewer.flyTo(apolloPointCloud)
  })

  var melbourne = document.getElementById("Melbourne")
  melbourne.addEventListener('click', (event) => {
    buildings.show = false;
    osm.checked = false;
    viewer.flyTo(melbournePointCloud)
  })

  getOpenskyNetworkData()
  
  async function getOpenskyNetworkData() {
    const OPEN_SKY_API = "https://opensky-network.org/api"

    const DIA_LAT_UPPER = 40.1000
    const DIA_LAT_LOWER = 39.5000
    const DIA_LON_LOWER = -105.5000
    const DIA_LON_UPPER = -103.5000
  
    const OPEN_SKY_API_CALL = OPEN_SKY_API + "/states/all?lamin="+DIA_LAT_LOWER+"&lomin="+DIA_LON_LOWER+"&lamax="+DIA_LAT_UPPER+"&lomax="+DIA_LON_UPPER

    console.log(OPEN_SKY_API_CALL)

    const response = await fetch(OPEN_SKY_API_CALL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response_json = await response.json()
    create_entities(response_json)
    setTimeout(getOpenskyNetworkData, 5000)
  }

  function create_entities(response_data) {
    console.log(response_data['states'])

    response_data['states'].forEach(element => {
      let exists = false
      viewer.entities.values.forEach(entity => {
        if (entity.name === element[1] + "_" + element[2]){
          entity.position = Cartesian3.fromDegrees(element[5], element[6], element[7])
          exists = true
        }
      })
      if (!exists){
        const temp = viewer.entities.add({
          name: element[1] + "_" + element[2],
          position: Cartesian3.fromDegrees(element[5], element[6], element[7]),
          ellipsoid: {
            radii: new Cartesian3(100.0, 100.0, 100.0),
            material: Color.RED
          },
          description: element[1] + "_" + element[2] + "<br>" + "lat: " + element[5] + "<br>" + "lon: " + element[6] + "<br>" + "alt: " + element[7]
        })}
    });


  }
  