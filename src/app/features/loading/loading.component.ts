import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import { Component, HostListener } from '@angular/core';
import {
  Texture,
  Scene,
  SphereGeometry,
  MeshPhongMaterial,
  Mesh,
  TextureLoader,
  Vector3,
  Euler,
  BoxGeometry,
  DirectionalLight,
  AmbientLight,
  WebGLRenderer,
  PerspectiveCamera,
} from 'three';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {

  constructor() {
    (window as any).isLoadingIntro = true;
  }

  ngAfterViewInit() {
    const waitForGlobals = () => {
      const scene: Scene = (window as any).threeScene;
      const camera: PerspectiveCamera = (window as any).threeCamera;
      const renderer: WebGLRenderer = (window as any).threeRenderer;

      if (!scene || !camera || !renderer) { // wait for the scene, camera, and renderer to be defined
        console.warn('LoadingComponent: Waiting for Three.js globals...');
        requestAnimationFrame(waitForGlobals);
        return;
      }

      const geometry: SphereGeometry = new SphereGeometry(1, 32, 32); // create sphere geometry
      const material: MeshPhongMaterial = new MeshPhongMaterial({
        color: 0x1db954,
        specular: 0x696969,
      }); // create sphere material to be green responsive to light
      const sphere: Mesh = new Mesh(geometry, material); // create sphere
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      scene.add(sphere); // add sphere to scene
      const spotifySignalWaves: Texture = new TextureLoader().load(
        '/SpotifySignalWaves.png'
      ); // load the signal waves
      const decalMaterial: MeshPhongMaterial = new MeshPhongMaterial({
        map: spotifySignalWaves,
        transparent: true,
        specular: 0x696969,
      }); // material for transparent png
      const decalPosition: Vector3 = new Vector3(0.8, 0.9, 1); // near the surface
      const decalOrientation: Euler = new Euler(
        Math.PI / -4,
        Math.PI / 6,
        Math.PI / 6
      ); // position facing the user
      const decalSize: Vector3 = new Vector3(1.7, 1.7, 1.7); // self explanatory
      const decalGeometry: DecalGeometry = new DecalGeometry(
        sphere,
        decalPosition,
        decalOrientation,
        decalSize
      ); // create decal geometry
      const decalMesh: Mesh = new Mesh(decalGeometry, decalMaterial); // create the decal mesh
      scene.add(decalMesh);
      const plateGeometry: BoxGeometry = new BoxGeometry(2, 0.1, 2); // create square plate geometry
      const plateMaterial: MeshPhongMaterial = new MeshPhongMaterial({
        color: 0x696969,
      }); // fifty shades of grey lol
      const plate: Mesh = new Mesh(plateGeometry, plateMaterial);
      plate.position.set(0, -1, 0); // position just below the sphere
      plate.rotation.y = Math.PI / 2; // rotate the plate 90 degrees
      plate.receiveShadow = true;
      plate.castShadow = true;
      scene.add(plate);
      const directionalLight: DirectionalLight = new DirectionalLight(
        0xffffff,
        1
      ); // create light
      directionalLight.target = sphere; // aim the light at the sphere
      directionalLight.castShadow = true; // cast shadow
      const ambientLight: AmbientLight = new AmbientLight(0xffffff, 0.1); // soft white ambient light
      scene.add(ambientLight);
      scene.add(directionalLight); // add light to scene
      let angle: number = 0; // light rotation
      const radius: number = 2; // radius of circular path for light rotation
      let yRotation: number = 0; // plate rotation
      function animate() {
        requestAnimationFrame(animate); // request call for the next frame
        angle += 0.01; // move light along circular path
        directionalLight.position.set(
          0, // light is rotating around the x axis counter clockwise
          radius * Math.cos(angle), // light is oscillating the y axis
          radius * Math.sin(angle) // light is oscillating the z axis
        );
        yRotation += 0.01; // increase the y rotation
        plate.rotation.y = angle; // rotate the plate
        renderer.render(scene, camera); // render the scene from the perspective of the camera
      }
      animate(); // start the animation
    };
    waitForGlobals();
  }

  @HostListener('document:keydown.enter', ['$event']) // listen for enter key
  toggleLoading(_: KeyboardEvent) {
    (window as any).isLoadingIntro = false; // no longer loading intro
  }
}
