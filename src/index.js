import {
    Viewer,
    Cartesian3,
    Math,
    Terrain,
    createOsmBuildingsAsync,
    Cesium3DTileset,
    Ion
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
  //viewer.scene.primitives.add(osmBuildingsTileset)
  
  const melbournePointCloud = await Cesium3DTileset.fromIonAssetId(43978)
  viewer.scene.primitives.add(melbournePointCloud)
  melbournePointCloud.pointCloudShading.maximumAttenuation = undefined
  melbournePointCloud.pointCloudShading.baseResolution = undefined
  melbournePointCloud.pointCloudShading.geometricErrorScale = 2.0
  melbournePointCloud.pointCloudShading.attenuation = true
  await viewer.zoomTo(melbournePointCloud)


  const apolloPointCloud = await Cesium3DTileset.fromIonAssetId(2537258)
  viewer.scene.primitives.add(apolloPointCloud)
  apolloPointCloud.pointCloudShading.maximumAttenuation = undefined
  apolloPointCloud.pointCloudShading.baseResolution = undefined
  apolloPointCloud.pointCloudShading.geometricErrorScale = 2.0
  apolloPointCloud.pointCloudShading.attenuation = true
  await viewer.zoomTo(apolloPointCloud)
  // Fly the camera to San Francisco at the given longitude, latitude, and height.
  // viewer.camera.flyTo({
  //   destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
  //   orientation: {
  //     heading: Math.toRadians(0.0),
  //     pitch: Math.toRadians(-15.0),
  //   },
  // });