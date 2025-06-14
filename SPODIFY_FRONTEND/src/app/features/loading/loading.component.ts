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
    const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 }); // create sphere material to be green
    const sphere = new THREE.Mesh(geometry, material); // create sphere
    scene.add(sphere); // add sphere to scene

    renderer.render(scene, camera); // render scene with camera

  }
}
