var fullScreenRenderer = vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance({
  background: [0, 0, 0],
});
var renderer = fullScreenRenderer.getRenderer();
var renderWindow = fullScreenRenderer.getRenderWindow();

const reader = vtk.IO.Core.vtkHttpDataSetReader.newInstance();

const actor = vtk.Rendering.Core.vtkVolume.newInstance();
const mapper = vtk.Rendering.Core.vtkVolumeMapper.newInstance();
mapper.setSampleDistance(0.7);
actor.setMapper(mapper);
mapper.setInputConnection(reader.getOutputPort());

// create color and opacity transfer functions
const ctfun = vtk.Rendering.Core.vtkColorTransferFunction.newInstance();
ctfun.addRGBPoint(200.0, 0.4, 0.2, 0.0);
ctfun.addRGBPoint(2000.0, 1.0, 1.0, 1.0);
const ofun = vtk.Common.DataModel.vtkPiecewiseFunction.newInstance();
ofun.addPoint(200.0, 0.0);
ofun.addPoint(1200.0, 0.5);
ofun.addPoint(3000.0, 0.8);
actor.getProperty().setRGBTransferFunction(0, ctfun);
actor.getProperty().setScalarOpacity(0, ofun);
actor.getProperty().setScalarOpacityUnitDistance(0, 4.5);
actor.getProperty().setInterpolationTypeToLinear();
actor.getProperty().setUseGradientOpacity(0, true);
actor.getProperty().setGradientOpacityMinimumValue(0, 15);
actor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
actor.getProperty().setGradientOpacityMaximumValue(0, 100);
actor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);
actor.getProperty().setShade(true);
actor.getProperty().setAmbient(0.2);
actor.getProperty().setDiffuse(0.7);
actor.getProperty().setSpecular(0.3);
actor.getProperty().setSpecularPower(8.0);

reader
  .setUrl(
    '/data.zip',
    { fullPath: true, compression: 'zip', loadData: true }
  )
  .then(() => {
    reader.update();
    renderer.addVolume(actor);
    renderer.resetCamera();
    renderer.getActiveCamera().zoom(1.5);
    renderer.getActiveCamera().elevation(70);
    renderer.updateLightsGeometryToFollowCamera();
    renderWindow.render();

    // full resolution 256x256x91 dataset
    /*
    reader
      .setUrl(
        '/dataFullRes.zip',
        { fullPath: true, compression: 'zip', loadData: true }
      )
      .then(() => {
        renderWindow.render();
      }); */
  });


