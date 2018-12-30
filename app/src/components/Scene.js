import React, { Component } from 'react';
import * as THREE from 'three';
import QuantumState from '../components/QuantumState'

var OrbitControls = require('three-orbit-controls')(THREE)

class ThreeScene extends Component {
    constructor(props) {
        super(props);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.redrawQuantumState = this.redrawQuantumState.bind(this);
    }

    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        window.addEventListener("resize", this.updateDimensions);

        //Add scene
        this.scene = new THREE.Scene();

        //ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            1,
            2000
        );
        this.camera.position.z = 400;

        // Lights
        let ambientLight = new THREE.AmbientLight(0x000000);
        this.scene.add(ambientLight);

        var lightLocations = [
            [0, -300, -50],
            [0, 300, -50],
            [300, 0, -50],
            [-300, 0, -50],
            [0, -300, 450],
            [0, 300, 450],
            [300, 0, 450],
            [-300, 0, 450],
            [0, -150, 0]
        ]

        for (let i = 0; i < lightLocations.length; i++) {
            let light = new THREE.PointLight(0xffffff, 2, 1000, 1.8);

            light.position.set( lightLocations[i][0], lightLocations[i][1], lightLocations[i][2] );
            this.scene.add(light);

            // Add marker points for lights
            // this.scene.add( new THREE.PointLightHelper(light, 10) );
        }

        // Fog
        this.scene.fog = new THREE.FogExp2(0xffffff, 0.0025);

        // Contols
        this.controls = new OrbitControls(this.camera, document.getElementById('bg'));
        this.controls.enablePan = false;
        this.controls.enableKeys = false;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.15;
        this.controls.rotateSpeed = 0.2;
        this.controls.target.set(0, 0, 200);
        this.controls.maxDistance = 300;

        //Add renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor('#000000', 1);
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);

        // Add quantum number event listeners
        document.getElementById('n').addEventListener('input', this.waitToRedrawQuantumState);
        document.getElementById('l').addEventListener('input', this.waitToRedrawQuantumState);
        document.getElementById('m').addEventListener('input', this.waitToRedrawQuantumState);

        // Quantum state redraw timer
        this.redrawTimer = 0;

        // Number of radial segments when drawing shapes
        this.radialResolution = 50;
        
        // Material for all the shapes
        this.quantumMaterial = new THREE.MeshLambertMaterial({
            wireframe: false, 
            side: THREE.DoubleSide, 
            color: new THREE.Color().setHSL(0.6, 0.6, 0.2),
            reflectivity: 0.5,
            metalness: 0,
            diffuse: 0.8
        });

        // Number of base items in the scene - i.e. the lights
        this.numberBaseChildren = this.scene.children.length;

        // Begin the animation
        this.start();
    }

    componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop = () => {
        cancelAnimationFrame(this.frameId)
    }

    animate = () => {
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene = () => {
        this.renderer.render(this.scene, this.camera)
        this.controls.update();
    }

    updateDimensions = () => {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    validateQuantumState = () => {
        let n = parseInt( document.getElementById('n').value );
        let l = parseInt( document.getElementById('l').value );
        let m = parseInt( document.getElementById('m').value );

        console.log(n, l, m);
        
        if ( isNaN(n) || isNaN(l) || isNaN(m) ) {
            console.log('invalid!')
            return false; // a value is empty
        } else if (n > 50 || n < 1 || l < 0) {
            console.log('invalid!')
            return false; // n or l negative, n too large. 
        } else if (Math.abs(m) > l || l >= n) {
            console.log('invalid!')
            return false; // +/- m must be less than l, l should be strictly less than n
        } 

        return true;
    }

    processRawContours(contourLines, gridSize) {
        let newLines = [];
        let il = -1;
        let ipNew = -1;
        let ip, ic, edgeZone, line, start, end, distance;

        for (ic = 0; ic < contourLines.length; ic++) {
            edgeZone = true;
            line = contourLines[ic];

            for (ip = 1; ip < line.length; ip++) {
                if (line[ip][0] === 0 || line[ip][0] === gridSize-1 || line[ip][1] === 0 || line[ip][1] === 2*gridSize-1) {
                    // point ip is an edge
                    edgeZone = true;
                } else {
                    if (edgeZone) {
                        edgeZone = false;
                        
                        // A new line is beginning
                        il += 1;
                        newLines[il] = [];
                        ipNew = -1;
                    } 

                    ipNew += 1
                    newLines[il][ipNew] = line[ip];
                }
            }
        }

        // Make sure there are no gaps when rendering lines
        for (il = 0; il < newLines.length; il++) {
            start = newLines[il][0];
            end = newLines[il][newLines[il].length - 1];

            distance = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));

            if (distance < 1) {
                // loop back on self because this curve is closed
                newLines[il].push(start);
            } else {
                // cap the top and bottom (close with the z-axis)
                newLines[il].unshift([0, start[1]]);
                newLines[il].push([0, end[1]]);
            }
        }

        return newLines;
    }

    downSampleArray(numbers, newLength) {
        // Creates a new array which maintains the end points of the input
        // array, and keeps reglarly indexed values

        if (numbers.length <= newLength) {
            return numbers;
        }

        let newArray = [];
        let keepRate = Math.floor(numbers.length / newLength);

        newArray.push(numbers[0]);

        for (let i = keepRate; i < numbers.length - 1; i += keepRate) {
            newArray.push(numbers[i]);
        }

        newArray.push(numbers[numbers.length - 1]);

        return newArray;
    }

    buildBufferGeometryFromContour(contour) {
        // Based on THREE.SphereBufferGeometry
        // https://github.com/mrdoob/three.js/blob/master/src/geometries/SphereGeometry.js

        let geometry = new THREE.BufferGeometry();

        let index = 0;
        let grid = [];

        let ix, iy;
        
        let vertex = new THREE.Vector3();
        let normal = new THREE.Vector3();

        let indices = [];
        let vertices = [];
        let normals = [];
        let uvs = [];

        for (iy = 0; iy < contour.length; iy++) {
            let verticesRow = [];
            let v = iy / contour.length;

            for (ix = 0; ix <= this.radialResolution; ix++) {
                var u = ix / this.radialResolution;
                var angle = 2 * Math.PI * u;

                vertex.x = contour[iy][0] * Math.cos(angle);
                vertex.y = contour[iy][0] * Math.sin(angle);
                vertex.z = contour[iy][1];

                vertices.push(vertex.x, vertex.y, vertex.z);

                normal.set(vertex.x, vertex.y, vertex.z).normalize();
                normals.push(normal.x, normal.y, normal.z);
                
                uvs.push(u, 1 - v);

                verticesRow.push(index++);
            }

            grid.push(verticesRow);
        }

        for (iy = 0; iy < contour.length - 1; iy++) {
            for (ix = 0; ix < this.radialResolution; ix++) {
                let a = grid[ iy ][ ix + 1 ];
                let b = grid[ iy ][ ix ];
                let c = grid[ iy + 1 ][ ix ];
                let d = grid[ iy + 1 ][ ix + 1 ];

                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }
        
        geometry.setIndex(indices);
	    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute(vertices, 3) );
	    geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute(normals, 3) );
        geometry.addAttribute( 'uv', new THREE.Float32BufferAttribute(uvs, 2) );

        return geometry;
    }

    waitToRedrawQuantumState = () => {
        clearTimeout(this.redrawTimer);

        if ( this.validateQuantumState() ) {
            this.redrawTimer = setTimeout(this.redrawQuantumState, 1000);
        }
    }

    redrawQuantumState() {
        let state = {
            n: parseInt( document.getElementById('n').value ),
            l: parseInt( document.getElementById('l').value ),
            m: parseInt( document.getElementById('m').value )
        }
        this.quantumState = new QuantumState(state);

        // Remove previous shells (but not the lights)
        for (let i = this.scene.children.length; i >= this.numberBaseChildren; i--) {
            this.scene.remove(this.scene.children[i]);
        }
        
        // Process the contours into individual lines to render
        let lines = this.processRawContours(this.quantumState.contourLines, this.quantumState.probGridSize);

        // Downsample the lines so they're faster to render
        for (let i = 0; i < lines.length; i++) {
            lines[i] = this.downSampleArray(lines[i], 100);
        }
        
        // Create shapes and add them to the scene
        for (let i = 0; i < lines.length; i++) {
            let bufferGeometry = this.buildBufferGeometryFromContour(lines[i]);
            let mesh = new THREE.Mesh(bufferGeometry);

            mesh.material = this.quantumMaterial;
            this.scene.add(mesh);
        }
    }

    render() {
        return(
            <div
                style={{ width: '100%', height: '100%', id: 'canvas' }}
                ref={(mount) => { this.mount = mount }}
            />
        )
    }
}

export default ThreeScene