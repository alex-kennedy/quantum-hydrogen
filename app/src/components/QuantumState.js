import nj from 'numjs';
// import { factorial, combinations } from 'mathjs';
// import math from 'mathjs';
import { gamma } from 'mathjs';
import { number } from 'prop-types';

// Factorial of an array
function factorial(k) {
    // if (typeof(k) == 'number') return(gamma(k + 1));

    return gamma(k + 1);

    // var out = nj.zeros(k.shape[0]);
    // for (var i=0; i<k.shape[0]; i++) out.set(i, gamma(k.get(i) + 1));
    // return out;
}

// Binomial coefficient where both inputs are numbers
function binomial(n, k) {
    return factorial(n) / (factorial(k) * factorial(n - k));
}

// Binomial coefficient where the arguments may be arrays
// function binomArray(n, k) {
//     if (typeof(n) == 'number' && typeof(k) == 'number') {

//         return binom(n, k);
    
//     } else if (n instanceof nj.NdArray && k instanceof nj.NdArray) {

//     } else if (n instanceof nj.NdArray) {

//         k = nj.multiply(nj.ones(n.shape), k);    

//     } else if (k instanceof nj.NdArray) {

//         n = nj.multiply(nj.ones(k.shape), n);

//     } else {

//         console.log(n, k);
//         throw "Didn't understand data types.";

//     }

//     var out = nj.ones(k.shape)
//     for (var i=0; i<k.shape[0]; i++) {
//         out.set(i, binom(n.get(i), k.get(i)));
//     }

//     return out;
// }


class QuantumState {
    constructor(props) {
        this.n = props.n;
        this.l = props.l;
        this.m = props.m;

        this.q = this.n + this.l
        this.p = 2*this.l + 1

        // The Bohr Radius
        this.BOHR = 5.29177211e-11 //m 

        this.getLegendreCoefs();
        this.getAssociatedLegendreCoefs();
        this.getSphericalHarmonicCoef();
        this.getLaguerreCoefs()
        this.getAssociatedLaguerreCoefs();
        this.getPsiNormalization();
    }

    getLegendreCoefs() {
        var c;
        var coefs = new Array(this.l);
        for (var k=0; k <= this.l; k++) {
            c = Math.pow(2, this.l);
            c *= binomial(this.l, k);
            c *= binomial((this.l + k - 1)/2, this.l);

            coefs[k] = c;
        }

        this.legCoefs = coefs;

        return coefs
    }

    getAssociatedLegendreCoefs() {
        var m = Math.abs(this.m);
        var coefs = new Array(this.l - m + 1);

        for (var i = 0; i <= this.l - m; i++) {
            coefs[i] = this.legCoefs[m + i] * factorial(i + m) / factorial(i);
        }

        this.assocLegCoefs = coefs;
        return coefs;
    }

    getSphericalHarmonicCoef() {
        var epsilon = this.m >= 0 ? Math.pow(-1, this.m) : 1;

        var m = this.m;
        var preFactor = Math.pow(((2*this.l + 1) / (4 * Math.PI)) * (factorial(this.l - m) / factorial(this.l + m)), 1/2)

        this.sphericalHarmonicCoef = epsilon * preFactor;
        return epsilon * preFactor;
    }

    getLaguerreCoefs() {
        var coefs = new Array(this.q + 1)

        for (var k = 0; k <= this.q; k++) {
            coefs[k] = Math.pow(-1, k) * Math.pow(factorial(this.q) / factorial(k), 2) / factorial(this.q - k);
        }
        
        this.lagCoefs = coefs;
        return coefs;
    }

    getAssociatedLaguerreCoefs() {
        var coefs = new Array(this.q + 1 - this.p);

        for (var k = 0; k <= this.q - this.p; k++) {
            coefs[k] = this.lagCoefs[this.p + k] * factorial(this.p + k) / factorial(k);
        }

        this.assocLagCoefs = coefs;
        return coefs;
    }

    getPsiNormalization() {
        var norm = Math.pow((2/(this.n*this.BOHR)), 3)
        norm *= factorial(this.n - this.l - 1);
        norm /= 2*this.n * Math.pow(factorial(this.n + 1), 3);
        norm = Math.sqrt(norm)
        norm /= Math.pow((this.n * this.BOHR), this.l)
        
        this.psiNormalization = norm;
        return norm;
    }
}

export default QuantumState 