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
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.SphereGeometry(1, 32, 32); // create sphere geometry
    const material = new THREE.MeshStandardMaterial({ color: 0xFF0000 }); // create sphere material to be red responsive to light
    const sphere = new THREE.Mesh(geometry, material); // create sphere
    scene.add(sphere); // add sphere to scene

    const light = new THREE.DirectionalLight(0xFFFFFF, 1); // create light
    light.position.set(1, 1, -0.5); // set light position to be behind the sphere
    light.castShadow = true; // cast shadow
    scene.add(light); // add light to scene

    renderer.render(scene, camera); // render scene with camera

  }
}
