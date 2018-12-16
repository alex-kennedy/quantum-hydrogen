import matplotlib.pyplot as plt
import numpy as np
from scipy.misc import factorial
from scipy.special import binom

# The Bohr Radius
BOHR = 5.29177211e-11 #m 

class Psi:
    def __init__(self, n, l, m):
        self.validate_nlm(n, l, m)

        self.n = n
        self.l = l
        self.m = m

        self.q = n + l
        self.p = 2*l + 1

        self.leg_k, self.leg_coefs = self.get_legendre_coefs()
        self.assoc_leg_k, self.assoc_leg_coefs = self.get_associated_legendre_coefs()
        self.spherical_harmonic_coef = self.get_spherical_harmonic_coef()
        self.lag_k, self.lag_coefs = self.get_laguerre_coefs()
        self.assoc_lag_k, self.assoc_lag_coefs = self.get_associated_laguerre_coefs()
        self.psi_normalization = self.get_psi_normalization()

    def validate_nlm(self, n, l, m):
        if type(n) != int or type(m) != int or type(l) != int:
            raise TypeError('n, l, and m must all be integers.')
        if abs(m) > l:
            raise ValueError('abs(m) must not be greater than l.')
        if n < 0 or l < 0:
            raise ValueError('n and l must be greater than or equal to 0.')

    def get_legendre_coefs(self):
        k = np.array(range(self.l + 1))
        coefs = 2**self.l * binom(self.l, k) * binom((self.l + k - 1)/2, self.l)

        # ensure we can take vectors
        k = k.reshape(len(k), 1)
        coefs = coefs.reshape(len(coefs), 1)

        return k, coefs

    def get_associated_legendre_coefs(self):
        m = abs(self.m)

        k = self.leg_k[m:] - m
        coefs = self.leg_coefs[m:] * factorial(k + m) / factorial(k)

        # ensure we can take vectors
        k = k.reshape(len(k), 1)
        coefs = coefs.reshape(len(coefs), 1)

        return k, coefs
        
    def get_spherical_harmonic_coef(self):
        epsilon = (-1)**self.m if self.m >= 0 else 1

        m = abs(self.m)
        pre_factor = np.sqrt(((2*self.l + 1) / (4 * np.pi)) * (factorial(self.l - m) / factorial(self.l + m)))

        return epsilon * pre_factor

    def get_laguerre_coefs(self):
        k = np.array(range(self.q + 1))
        coefs = (-1)**k * factorial(self.q)**2 / (factorial(k)**2 * factorial(self.q - k))

        # ensure we can take vectors
        k = k.reshape(len(k), 1)
        coefs = coefs.reshape(len(coefs), 1)

        return k, coefs

    def get_associated_laguerre_coefs(self):
        k = self.lag_k[self.p:] - self.p
        coefs = self.lag_coefs[self.p:] * factorial(k + self.p) / factorial(k)

        # ensure we can handle arrays
        coefs = coefs.reshape(len(coefs), 1)
        k = k.reshape(len(k), 1)

        return k, coefs

    def get_psi_normalization(self):
        norm = np.sqrt((2/(self.n*BOHR))**3 * factorial(self.n - self.l - 1) / (2*self.n*(factorial(self.n + 1)**3)))
        norm /= (self.n * BOHR)**self.l
        return norm

    def legendre(self, x):
        return np.sum(self.leg_coefs * x**self.leg_k, axis=0)

    def associated_legendre(self, x):
        multiplier = (1 - x**2) ** (abs(self.m) / 2)
        return multiplier * np.sum(self.assoc_leg_coefs * x**self.assoc_leg_k, axis=0)

    def spherical_harmonic(self, theta):
        return self.spherical_harmonic_coef * self.associated_legendre(np.cos(theta))

    def laguerre(self, x):
        return np.sum(self.lag_coefs * x**self.lag_k, axis=0)

    def associated_laguerre(self, x):
        return (-1)**self.p * np.sum(self.assoc_lag_coefs * x**self.assoc_lag_k, axis=0)

    def probability_density(self, r, theta):
        psi = self.psi_normalization * \
            np.exp(-r / (self.n * BOHR)) * \
            (2 * r) ** self.l * \
            self.associated_laguerre(2*r / (self.n * BOHR)) * \
            self.spherical_harmonic(theta)
        return np.abs(psi) ** 2


if __name__ == '__main__':
    n, l, m = 5, 2, 1
    electron = Psi(n, l, m)

    x = np.linspace(-2*n**2*BOHR, 2*n**2*BOHR, 500)
    thing = np.empty([500,500])
    for i in range(500):
        r = np.sqrt(x[i]**2 + x**2)
        theta = np.arctan(x / x[i])
        thing[i, :] = electron.probability_density(r, theta)
    plt.imshow(thing, cmap='Blues')
    plt.show()
