import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>; // canvas element reference

  ngAfterViewInit() {
    const canvas = this.canvas.nativeElement; // canvas native element reference
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);
    camera.position.set(2, 2, 2); // set position directly above
    camera.lookAt(0, 0, 0); // look at the center of the sphere
    const renderer = new THREE.WebGLRenderer({ canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // make it look more realistic
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const geometry = new THREE.SphereGeometry(1, 32, 32); // create sphere geometry
    const material = new THREE.MeshPhongMaterial({ color: 0x1DB954, specular:0x696969}); // create sphere material to be red responsive to light
    const sphere = new THREE.Mesh(geometry, material); // create sphere
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere); // add sphere to scene

    const plateGeometry = new THREE.BoxGeometry(2, 0.1, 2); // create square plate geometry
    const plateMaterial = new THREE.MeshPhongMaterial({ color: 0x696969}); // fifty shades of grey lol
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.position.set(0, -1, 0); // position just below the sphere
    plate.rotation.y = Math.PI / 2; // rotate the plate 90 degrees
    plate.receiveShadow = true;
    plate.castShadow = true;
    scene.add(plate);

    const light = new THREE.DirectionalLight(0xFFFFFF, 1); // create light
    light.target = sphere; // aim the light at the sphere
    light.castShadow = true; // cast shadow

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1); // soft white ambient light
    scene.add(ambientLight);

    scene.add(light); // add light to scene

    let lightAngle = 0; // light rotation
    const radius = 2; // radius of circular path for light rotation


    function animate() {
      requestAnimationFrame(animate); // request call for the next frame
      lightAngle += 0.01; // move light along circular path
      light.position.set(
       0,// light is rotating around the x axis counter clockwise
       radius * Math.cos(lightAngle), // light is oscillating the y axis
        radius * Math.sin(lightAngle) // light is oscillating the z axis
      );
      renderer.render(scene, camera); // render the scene from the perspective of the camera
    }

    animate(); // start the animation
  }
}
