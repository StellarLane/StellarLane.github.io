---
title: BME2301 Biomedical Signals and Systems (I) (EN)
category: BME
tags:
  - 25sp
  - BME
date: 2025-07-27
summary: 好难学不懂 >.<
---

## Intro

Systems are continuous-time systems or discrete-time systems, this is depended on the type of the inpust signals the system gets. Since most digital signals are discrete now, the systems today are likely to be discrete-time systems
This course is mainly focused of linear time-invariant systems

## Basic signals

### transformation of independent variable

![alt text](/sigsys_1/image.png)

- time scaling x(t) -> x(t/a) (discrete signals often are not "squeezable" though extendable)
- time shift
- time reversal(actually a special form of scaling)

### transformation of discrete signals in the y-axis

(for continous ones just refer to calculus)
Fisrt difference: y[n] = x[n] - x[n-1]
DT Unit Step Signal -> first difference/Pointwise subtraction-> DT Unit Impulse Signal
Running sum of a DT signal: $\sum{}x[k]$
If you first take finite dif, and then the running sum, we don‘t get the same signal(+C)

### C(continous)T(time) sinusoidal signals

A sinusoidal signal that is derived from a standard cosine function through time scaling/shifting.etc
$$x(t) = A \cos(\omega t + \Phi)$$

#### properties

1. periodicity: x(t) equals itself after a time shift of T<sub>0</sub>
2. a time shift is equivalent to a phase change
   $$\forall t_0, \exist \Phi_0, \cos(\omega(t - t_0) + \Phi) = \cos(\omega t + \Phi + \Phi _0), vice\space versa$$
3. symmetry of sinusoidal signals

### CT complex exponential signal

Algebraic definition:
$$x(t) = C e^{\alpha t}, C, \alpha \isin \Complex$$
let $C = |C| e^{j \Phi}$, $\alpha = \gamma + j \omega_0$ and we get

$$
x(t) = |C| e^{\gamma t} \cos(\omega_0 t + \varphi) + j |C| e^{\gamma t} \sin(\omega_0 t + \varphi)
$$

The rectangular/Cartesian form of complex exponential signal
![alt text](/sigsys_1/image-3.png)

### Signal decomposition

almost all real signals can be represented by linear combinations of sinusoidal signals.
almost all complex signals can be represented by linear combinations of complex exponential signals.

### D(discrete)T(time) complex sinusoidal signal

#### (lost) properties

1. phase change != time shift(reverse holds)
   ![alt text](/sigsys_1/image-1.png)
2. not neccessarily periodic(only when $2 \pi / \Omega_0$)
3. different frequencies may not imply different signals
   ![alt text](/sigsys_1/image-2.png)

### DT real exponential

Algebraic definition:
$$x[N] = C \alpha^n,  C, \alpha \isin \real, n \isin \N$$
can only be seen as the direct sampling of CT real exponential ($Ce^{\beta t}$) when $\alpha > 0$

### DT complex exponential

Algebraic definition:
$$x[n] = C \alpha^n, C, \alpha \isin \Complex$$
Rectangular form:
$$x[n] = |C| |\alpha|^n \cos(\Omega_0 n + \varphi) + j |C| |\alpha|^n \sin(\Omega_0 n + \varphi)$$
it is a direct sampling of CT complex exponential signals

### Energy and power of signals

energy:

$$
E_\infty = \int_{-\infty}^{\infty} |x(t)|^2 \, dt
$$

$$
E_\infty = \sum_{n=-\infty}^{\infty} |x[n]|^2
$$

power

$$
P_\infty = \lim_{T \to \infty} \frac{1}{2T} \int_{-T}^{T} |x(t)|^2 \, dt
$$

$$
P_\infty = \lim_{N \to \infty} \frac{1}{2N\bold{+1}} \sum_{n=-N}^{N} |x[n]|^2
$$

where | | means absolute value for real and magnitude for complex

### Unit step & unit impulse

#### DT

step: u[n] = 1 if n>=0 else 0 $u[n]\space or \space u(t)$
impulse: u[n] = 1 if n==0 else 0 $\delta[n]\space or\space \delta(t)$
unit impulse is the first dif of the unit step, unit step is the running sum of unit impulse

#### CT

it will be ill-defined if we just copy the discrete definitions into the continous field.
![alt text](/sigsys_1/image-4.png)

## Further Introduction to Systems

### Equations for descriptions of systems

systems are not normal functions...or to be more precise, they take a function as a variable, and output another...

- Time-shifting sys: $y(t)=x(t-T)$
- Time-scaling sys: $y(t)=x(at)$
- Squarer: $y(t)=(x(t))^2$
- Differentiator: $y(t)= \frac{dx(t)}{dt}$
- Integrator: $y(t)=\int_{-\inf}^{t}x(\tau)d\tau$

### System interconnections

- Series interconnection/cascaded interconnection: order (generally) matters
- Parallel interconnection: order does not matter
- Feedback interconnectoin: order matters

### Systems properties

System properties are partial knowledge about the input/output relationship: Memoryless, Causality, Invertibility, Stability, Linearity, Time-invariance(The first two are time-dependent and the rest are not)

- Time-dependent properties: it only considers how systems behave along the time dimension
- Time-independent properties: it only considers how systems behave along the signal dimension(about matching one input into another)

#### Properties

- Memoryless property:
  - it only depends on the current time point
- Causality property:
  - it only depends on previous knowledge
  - second order DT differentiator(y[n] = x[n-1] + x[n+1] - 2x[n]) is not causality
- Invertibility:
  - there is only one input signal for every output signal
  - Running integral have invertibility
- Stability:
  - if a small input generates a small output(bounded input generates bounded output, or BIBO)
  - if x(t) is bounded , there is a positve m that |x(t)| < m for all t
  - squarers are stable
  - A running integral/sum is not stable(note that the bound doesn't apply to t, but to x(t))

## Convolution

Convolution only exists on linear and time-invariant systems, it mathematically describes how to predict the output for
linear and time-invariant systems, it can be implemented by both hand calculation and computers.

- Linearity: defination
  - x<sub>1</sub> -> y<sub>1</sub>, x<sub>2</sub> -> y<sub>2</sub>, then x<sub>1</sub> + x<sub>2</sub> = y<sub>1</sub> + y<sub>2</sub>
  - ax<sub>1</sub>(t) -> ay<sub>1</sub>(t) for any complex number a
  - (a combined version) a<sub>1</sub>x<sub>1</sub> + a<sub>2</sub>x<sub>2</sub> -> a<sub>1</sub>y<sub>1</sub> + a<sub>2</sub>y<sub>2</sub>

Systems with the form $ y(t) = L\{x(t)\} + y_0(t) $, where $ L\{\cdot\} $ represents a linear system, and $ y_0(t) $ represents a signal independent of $ x(t) $, are called \textit{incrementally linear systems} (to indicate they are linear systems except for addition of another fixed signal), where y<sub>0</sub> is known as the zero-input response

- Time-invariance: aka "shift-invariance"
  - x(t - t<sub>0</sub>) -> y(t - t<sub>0</sub>) (similar with DT ones)
- $x[n] = \sum_{k=-\infty}^{\infty} x[k]\delta[n-k]$ (a sum of weighted, shifted unit impulses)

### Convolution sum&integral

DT LTI systems
Let $h[n]$ represent the **unit impulse response**: $\delta[n] \to h[n]$.
for any LTI:

$$
  \sum_{k=-\infty}^{\infty} a_k x_k[n-n_k] \to \sum_{k=-\infty}^{\infty} a_k y_k[n-n_k].
$$

Apply this property to

$$
  \sum_{k=-\infty}^{\infty} x[k]\delta[n-k],
$$

we have:

$$
x[n] = \sum_{k=-\infty}^{\infty} x[k]\delta[n-k] \to \sum_{k=-\infty}^{\infty} x[k]h[n-k] = x[n] * h[n]
$$

however, this wont work with CT systems, for CT it is:

$$x(t) \to \int_{-\infty}^{+\infty} x(\tau) h(t - \tau) d\tau = x(t) * h(t)$$

we see the change is that it is not just the response times the pulse(since the pulse is infinity, we times an additional d$\tau$, which I suppose can be understood as... the duration?

for DT it is conv sum, and for CT it is intergral, but most of the time we just call it convolution in general.

### Some properties

$x(t) * \delta(t-T) = x(t-T)$

$x(t)\delta(t-T) = x(T)\delta(t-T)$

$\int_{-\infty}^{\infty} x(t)\delta(t-T)dt = x(T)$

Mathematical Properties:

- x[n] \* h[n] = h[n] \* x[n] (commutative property)
- x \* {h<sub>1</sub> \* h<sub>2</sub>} = {x \* h<sub>1</sub>} \* h<sub>2</sub> (associative property)
  Above makes two cascading LTI systems switchable
- if x(t) -> y(t) then dx(t)/dt -> dy(t)/t (differentiation property)
  It allow syou to predict the output of a signal(e.a if you know the response of a step signal you know what the response of the impulse signal is like)

### Implementation of convolution

#### RSMS/RSMI procedure

- **Reverse** $h[k]$, generating $h[-k]$
- **Shift** the signal $h[-k]$ by $n_0$, generating $h[-(k-n_0)] = h[n_0 - k]$
- **Multiply** $x[k]$ with $h[n_0 - k]$, generating $x[k]h[n_0 - k]$
- **Sum** from $k = -\infty$ to $k = +\infty$, generating $y[n_0] = \sum_{k=-\infty}^{\infty} x[k]h[n_0 - k]$
  for CT signals it's basically the same, except the last step is integral instead of sum

### Use of convolution

Convolution can be used to prove some properties of a system in a more straightforward way

#### Memoryless?

- Given a system is LTI, the system is also memoryless iff

  $y(t_0) = \int_{-\infty}^{\infty} x(\tau) h(t_0 - \tau) d\tau \text{ depends only on } x(t_0)$

  which is equivalent to say $h(t_0 - \tau) \neq 0$ only if $\tau = t_0$, that is,
  $h(t) \neq 0$ only if $t = 0$.

- Without loss of generality, $h(t) \neq 0$ only if $t = 0$ means:

  $h(t) = k\delta(t) \text{ for some } k \neq 0$

  Since $x(t) * k\delta(t) = kx(t)$, the only memoryless LTI system is
  the rescaling system.

#### Causality?

- General definition: For any $x(t)$, its output $y(t)$, and any time index $t_0$, $y(t_0)$ is dependent only on $x(t)$ for $t \le t_0$

- Given a system is LTI, the above condition means

  $y(t_0) = \int_{-\infty}^{\infty} x(\tau)h(t_0 - \tau)d\tau$ depends only on $x(t)$ for $t \le t_0$

- That is, $h(t_0 - \tau) = 0$ for $t > t_0$. That is, $h(t) = 0$ for $t < 0$

- In other words, an LTI system is causal if

  $h(t) = 0 \text{ for } t < 0$

  Note this is much easier to evaluate than the original definition of causality!

#### "Initial Zero"

An initial-rest system generates nonzero output values only after
the input signal becomes nonzero.

a causal or a memoryless system doesn't necessarily have the initial rest property.
But a LTI system have causality if it has initial rest, the reverse also applies.

#### Stability?

- Recall the definition of stability: bounded input generates bounded output (BIBO)

- Assuming LTI, BIBO holds if and only if the impulse response is absolutely summable (integrable) (integration/sum not infinity)

#### Invertibility?

- Recall the definition of invertibility: a system A is invertible if and only if different inputs always generate different outputs.

- When A is invertible, there exists another system A₁, such that the cascaded system (A- A₁) is an identity system.

## LCCDE Systems

Linear Constant-Coefficient Differential Equations Systems.

### From LCCDE to LCCDE systems

$\sum_{k=0}^{N} a_k \frac{d^k y(t)}{dt^k} = \sum_{k=0}^{M} b_k \frac{d^k x(t)}{dt^k}$

The order of LCCDE refers to the highest derivative of the output y(t) (that is, N).

solving it:
homogeneous solution + particular solution

LCCDE have infinite solutions, but LCCDE systems don't, because LCCDE systems have **initial state**

We can manully select a time, and make it the starting point, this starting point might not have a zero response, and the response the moment before the starting point are seen as the initial state.

### LTI and LCCDE systems

**Zero-state response**: response of the system when there is no initial state = response of the system to the input signal

**Zero-input response**: response of the system when there is no input = response of the system to the initial state

#### Solving LCCDE Equations

##### Solving the solution directly

Solve a 1st order LCCDE: $\frac{dy(t)}{dt} + 2y(t) = e^{3t}u(t)$

**Particular solution** of this LCCDE strictly satisfies the equation.

- A general form of solution to $\frac{dy_p(t)}{dt} + \alpha y_p(t) = e^{\beta t}u(t)$ is
  $$y_p(t) = K(e^{\beta t} - e^{-\alpha t})u(t)$$
- Plugging in the values, we get $\frac{d}{dt} [K(e^{3t} - e^{-2t})u(t)] + 2K(e^{3t} - e^{-2t})u(t) = e^{3t}u(t)$.
- Solving for K, we find $K = \frac{1}{5}$.
- Thus, the particular solution is: $y_p(t) = \frac{1}{5}(e^{3t} - e^{-2t})u(t)$.

**Homogeneous solution** is the function $y_h(t)$ satisfying $\frac{dy(t)}{dt} + 2y(t) = 0$.

- Homogeneous solutions are of the form $y_h(t) = Ae^{at}$.
- Substituting into the homogeneous equation gives $Aae^{at} + 2Ae^{at} = (a+2)Ae^{at} = 0$. Thus, $a = -2$ and $y_h(t) = Ae^{-2t}$ is the homogeneous solution.
- Note that $A$ can be any number, and the homogeneous equation will still be satisfied.
- There is an infinite number of homogeneous solutions, each in the form $y_h(A, t) = Ae^{-2t}$ for some number $A$.

- The complete solution to the LCCDE is the sum of the particular and homogeneous solutions: $y(t) = y_p(t) + y_h(A, t)$.

for this example, that is:
$y(t) = \frac{1}{5}(e^{3t} - e^{-2t})u(t) + Ae^{-2t}$.

- Every LCCDE has infinitely many solutions, each expressible by a sum of the particular solution and one homogeneous solution.

##### Classical Approach

Wiped out the u(t) and assume it is only in the positive time domain(which is often the case in real life)
and solve it in the (I suppose is more like the) normal and intentional way

Take the previous example:

- Modify the equation to $\frac{dy(t)}{dt} + 2y(t) = e^{3t}$, $t > 0$. [$u(t)$ dropped & $t>0$ added]
- The particular solution for the modified input must be of the form $Ke^{3t}$. That leads to $y_p(t) = \frac{1}{5}e^{3t}$ (Instead of $\frac{1}{5}(e^{3t} - e^{-2t})u(t)$ for the original equation)
- The homogeneous solution is still $Ae^{-2t}$. $A$ is to be determined by the initial state.

- The complete solution for the modified input is thus $\frac{1}{5}e^{3t} + Ae^{-2t}$, $t > 0$[Initial state is NOT directly applicable].
- Then, we need to use the continuity assumption about the system output, that is, the output signal is a continuous function at any time (true for most realistic systems).
- By the continuity assumption, $y(0^+) = y(0^-) = \gamma$. Then $(\frac{1}{5}e^{3t} + Ae^{-2t})|_{t=0^+} = \gamma \implies \frac{1}{5} + A = \gamma \implies A = \gamma - \frac{1}{5}$.
- Thus, the homogeneous solution for the classical approach is $(\gamma - \frac{1}{5})e^{-2t}$ (Instead of $\gamma e^{-2t}$ for the original equation)
- The total output is then $\frac{1}{5}e^{3t} + (\gamma - \frac{1}{5})e^{-2t} = \frac{1}{5}(e^{3t} - e^{-2t}) + \gamma e^{-2t}$ for $t > 0$. (the total output is equal to that derived from the original equation)

---

| The classical approach                                                            | Solving the original equation                                                       |
| :-------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| $\frac{1}{5}e^{3t} + (\gamma - \frac{1}{5})e^{-2t}$                               | $\frac{1}{5}(e^{3t} - e^{-2t}) + \gamma e^{-2t}$                                    |
| - $\frac{1}{5}e^{3t}$ is the particular solution (forced response).               | - $\frac{1}{5}(e^{3t} - e^{-2t})$ is the particular solution (zero-state response). |
| - $(\gamma - \frac{1}{5})e^{-2t}$ is the homogeneous solution (natural response). | - $\gamma e^{-2t}$ is the homogeneous solution (zero-input response).               |
| Par. and hom. solutions DO NOT correspond to zero-state and zero-input response   | Par. and hom. solutions correspond to zero-state and zero-input response            |

## Fourier Series Representation of Periodic Signals

Before we are using impulses as the building block to represent signals (especially in convolution), but the properties of the impulse make it quite complicated to represent some signals, for example, for
$$x(t) = \cos(\omega_0 t)$$
with impulse it can be represented as
$$x(t) = \int_{-\infty}^{\infty} \cos(\omega_0 \tau) \delta(t - \tau) d\tau$$
with complex exponentials it is
$$x(t) = \frac{1}{2} (e^{j\omega_0 t} + e^{-j\omega_0 t})$$
which obviously looks better than the impulse solution

### HRCE(Harmonically Related Complex Exponentials)

A set of signals, $\{ \phi_k(t) | k \in \mathbb{Z} \}$, is called a set of Harmonically Related Complex Exponentials if and only if

$$
\phi_k(t) = e^{jk\omega_0 t} \quad = e^{jk(2 \pi / T_0) t}  \text{for each } k \in \mathbb{Z}
$$

Where $\omega_0 \neq 0$ is called the fundamental frequency for the set of harmonically related complex exponentials.

- Harmonically Related Complex Exponentials (HRCE) is a set of complex exponential signals.
- These exponential signals are "harmonically related", in that the frequency of $\phi_k(t)$ is $k\omega_0$ ($k$-fold multiple of the fundamental frequency).
- A set of HRCE is known iff its fundamental frequency is known.
- $k$ can be both positive or negative integers.
- they share a common period(T<sub>0</sub>)

### The Fourier Series Representation

$$
\begin{cases}
x_{T_0}(t) = \sum_{k=-\infty}^{+\infty} a_k e^{jk\omega_0 t} & (1) \\
a_k = \frac{1}{T_0} \int_{T_0} x_{T_0}(t) e^{-jk\omega_0 t} dt & (2)
\end{cases}
$$

- $a_k$ is called the **Fourier series coefficient** or the **spectral coefficient** of $x_{T_0}(t)$.
- $a[k] = \{a_k\}$ is called the **Fourier series spectrum** of $x_{T_0}(t)$.
- Equation (1) is called the **synthesis equation**: almost every periodic signal can be synthesized/represented by a linear combination of harmonics in the HRCE.
- Equation (2) is called the **analysis equation** (spectral analysis): it tells you how to generate the coefficients for the FS representation.

We also have the "Partial Sum":

$$
x(t) = \sum_{k=-\infty}^{+\infty} a_k e^{jk\omega_0 t}, \quad \omega_0 = \frac{2\pi}{T_0}
$$

$$
x_N(t) \triangleq \sum_{k=-N}^{N} a_k e^{jk\omega_0 t} \quad \text{partial sum}
$$

It's easy to recognize that $\lim_{N \to +\infty} x_N(t) = x(t)$

### Displaying The FS Spectrum

- When we have the Fourier series spectrum, we often want to plot the spectrum, because it reflects the frequency components contained in $x_{T_0}(t)$.
- However, notice the Fourier series coefficients are complex numbers, so we need at least two plots to show the spectrum (magnitude & phase).

---

For example: let's display the FS Spectrum of the following signal

$$
x(t) = 1 + \sin(\omega_0 t) + 2 \cos(\omega_0 t) + \cos\left(2\omega_0 t + \frac{\pi}{4}\right)
$$

$$
x(t) = 1 + \frac{1}{2j}[e^{j\omega_0 t} - e^{-j\omega_0 t}] + [e^{j\omega_0 t} + e^{-j\omega_0 t}] + \frac{1}{2}[e^{j(2\omega_0 t + \pi/4)} + e^{-j(2\omega_0 t + \pi/4)}]
$$

Collecting terms, we obtain

$$
x(t) = 1 + \left(1 + \frac{1}{2j}\right)e^{j\omega_0 t} + \left(1 - \frac{1}{2j}\right)e^{-j\omega_0 t} + \left(\frac{1}{2}e^{j\pi/4}\right)e^{j2\omega_0 t} + \left(\frac{1}{2}e^{-j\pi/4}\right)e^{-j2\omega_0 t}
$$

Thus, the Fourier series coefficients for this example are

$$
a_0 = 1,
a_1 = \left(1 + \frac{1}{2j}\right) = 1 - \frac{1}{2}j,
a_{-1} = \left(1 - \frac{1}{2j}\right) = 1 + \frac{1}{2}j,
$$

$$
a_2 = \frac{1}{2} e^{j\pi/4} = \frac{\sqrt{2}}{4}(1 + j),
a_{-2} = \frac{1}{2} e^{-j\pi/4} = \frac{\sqrt{2}}{4}(1 - j),
a_k = 0, |k| > 2.
a_0 = 1,
$$

to polar form

$$
a_{\pm 1} = \frac{\sqrt{5}}{2} e^{-j \text{atan}(1/2)},
$$

$$
a_{\pm 2} = \frac{1}{2} e^{j \text{atan}(1)} = \frac{1}{2} e^{j \pi/4},
$$

$$
a_{\pm k} = 0 \text{ for } |k| \ge 3
$$

and we will get two plots:
![alt text](/sigsys_1/image-5.png)
both parts are critical for describing a signal, if a signal has shifted in the time domain, the magnitude spectrum will very likely to remain unchanged while the phase spectrum will have changes(and it's not simply a shift in the whole pattern)

## Spectrum Analysis for LTI Systems

### Eigenfunction

**Definition**: for a given LTI system, an input signal that generates an output signal that is simply the input multiplied with a constant is called an eigenfunction of the system.

If $x(t) * h(t) = \lambda x(t)$, then $x(t)$ is an eigenfunction of the system $h(t)$, and $\lambda$ is the eigenvalue associated with the eigenfunction.
(quite similar for definition for the eigen-things in linear algebra)

**complex exponentials are always eigenfunctions of an LTI system**.

### A New Way of Analyzing LTI Systems

Let $x(t) = e^{j\omega t}$, then the output is
$$y(t) = \int_{-\infty}^{\infty} x(t-\tau)h(\tau)d\tau = \int_{-\infty}^{\infty} e^{j\omega(t-\tau)}h(\tau)d\tau = e^{j\omega t} \int_{-\infty}^{\infty} e^{-j\omega\tau}h(\tau)d\tau$$

Since $\int_{-\infty}^{\infty} e^{-j\omega\tau}h(\tau)d\tau$ is not dependent on $t$, we can write the output as
$$y(t) = T\{e^{j\omega t}\} = H(j\omega)e^{j\omega t}$$
Where
$$H(j\omega) \triangleq \int_{-\infty}^{\infty} e^{-j\omega\tau}h(\tau)d\tau$$
The eigenvalue associated with $e^{j\omega t}$. It is dependent on the frequency $\omega$, the impulse response, but not on $t$.

Fourier series representation decomposes a signal into a linear combination of harmonically related eigenfunction signals.
$$x_{T_0}(t) = \sum_{k=-\infty}^{+\infty} a_k e^{jk\omega_0 t}$$

Then the response of an LTI system to an arbitrary periodic signal would be
$$y(t) = \sum_{k=-\infty}^{\infty} a_k \mathcal{T}\{e^{jk\omega_0 t}\} = \sum_{k=-\infty}^{\infty} a_k [H(jk\omega_0)e^{jk\omega_0 t}]$$
$$= \sum_{k=-\infty}^{\infty} [a_k H(jk\omega_0)]e^{jk\omega_0 t} = \sum_{k=-\infty}^{\infty} b_k e^{jk\omega_0 t}$$
Output is a periodic signal with the same period & a spectrum of $b_k = a_k H(jk\omega_0)$

---

**Generally the idea is, any input signal can be broken down to a series of eigenfunctions of any LTI system, so the input can be assembled from a series of eigenfunctions, rescaled according to the corresponding eigenvalue.**

---

![alt text](/sigsys_1/image-6.png)

#### Advantages

- First, computational advantages over convolution. For example: what is the output for $x(t) = \cos(\frac{2}{3}t)$ and $h(t) = \frac{\sin(t)}{\pi t}$?
  - Convolution is difficult
  - Frequency domain:
    - $H(j\omega) = \int_{-\infty}^{\infty} e^{-j\omega\tau} \frac{\sin(\tau)}{\pi \tau} d\tau = \begin{cases} 1, & |\omega| < 1 \\ 0, & \text{otherwise} \end{cases}$
    - $a_k$ is nonzero only for $k = -1 \& 1$.
    - Note that since $\omega_0 = \frac{2}{3}$, $H(jk\omega_0) = 1$ only for $k = -1, 0, 1$
- Second, it provides critical insights to help us understand how the system changes each harmonic:
  - If $|H(jk\omega_0)|$ is greater than 1, the $k^{th}$ harmonic gets strengthened in the output spectrum
  - If $|H(jk\omega_0)|$ is less than 1, the $k^{th}$ harmonic gets attenuated (weakened) in the output spectrum

The second one leads to the important concept of "filtering".

### Filters

So the filters is mostly a function for H(j$\omega$)

- Type one filters(Frequency-selective filters, or ideal filters): just 1 or 0, no other values
  ![alt text](/sigsys_1/image-24)

- Type two filters(requency-shaping filters): most reshape, not completely kill or live
  ![alt text](/sigsys_1/image-7.png)
  (actually this is the filter for differentiater)

## Performing Fourier Transform on Aperiodic Functions

![alt text](/sigsys_1/image-8.png)
![alt text](/sigsys_1/image-9.png)
![alt text](/sigsys_1/image-10.png)
![alt text](/sigsys_1/image-11.png)
![alt text](/sigsys_1/image-12.png)

---

**Fourier transform**

previously Analysis Equation
$$X(j\omega) = \int_{-\infty}^{\infty} x(t)e^{-j\omega t} dt$$

**Inverse Fourier transform**

previously Synthesis Equation
$$x(t) = \frac{1}{2\pi} \int_{-\infty}^{\infty} X(j\omega)e^{j\omega t} d\omega$$

---

### Fourier Transform Pair

If $X(j\omega) = \mathcal{F}\{x(t)\}$, we say $X(j\omega)$ and $x(t)$ are a Fourier transform pair.

A well-known Fourier transform pair is the rectangle-sinc pair, that is, the Fourier transform of a rectangle signal is a "sinc" signal.

This pair is very important because we often need to analyze the FT of a rectangular signal or IFT of a rectangular spectrum.

Fourier transform pairs are completely invertible, for example, a "sinc" in time domain will be a "rectangle signal" when transformed to the frequency domain.

## Properties of Fourier Transform

### Performing Fourier Transform on Periodic Signals

To find the Fourier Transform (F.T.) spectrum of a periodic signal $x_{T_0}(t)$, we are looking for a spectrum $X(j\omega)$ that satisfies:

$$\qquad X(j\omega) = \int_{-\infty}^{\infty} x_{T_0}(t) e^{-j\omega t} dt \quad (1)$$

$$\qquad x_{T_0}(t) = \frac{1}{2\pi} \int_{-\infty}^{\infty} X(j\omega) e^{j\omega t} d\omega \quad (2)$$

Let $a_k$ be the Fourier Series (F.S.) spectrum of $x_{T_0}(t)$. If Equation (2) holds, we must have:

$$\qquad \frac{1}{2\pi} \int_{-\infty}^{\infty} X(j\omega) e^{j\omega t} d\omega = \sum_{k=-\infty}^{\infty} a_k e^{jk\omega_0 t}$$

The left side is a "sum" over all frequencies, while on the right is sum over a discrete set of frequencies

So X(j$\omega$) is some function times $a_k$, and the function is only non-zero on certain frequencies, which is an impulse train.

The equation $\frac{1}{2\pi} \int_{-\infty}^{\infty} X(j\omega) e^{j\omega t} d\omega = \sum_{k=-\infty}^{\infty} a_k e^{jk\omega_0 t}$ indicates that $X(j\omega)$ is an impulse train located at the harmonic frequencies $k\omega_0$.

That is **The Fourier Transform for Periodic Signals**

$$X(j\omega) \triangleq 2\pi \sum_{k=-\infty}^{\infty} a_k \delta(\omega - k\omega_0)$$

### Linearity

For sure

### Time shift

**Fourier transform:**
$$\text{If } x(t) \overset{\mathcal{F}}{\longleftrightarrow} X(j\omega), \text{ then } x(t - t_0) \overset{\mathcal{F}}{\longleftrightarrow} e^{-j\omega t_0} X(j\omega)$$

which is generally the same with

**Fourier series:**

$$\text{If } x(t) \overset{\text{F.S.}}{\longrightarrow} a_k, \text{ then } x(t - t_0) \overset{\text{F.S.}}{\longrightarrow} e^{-jk\omega_0 t_0} a_k$$

### Time reversal

**Fourier transform:**
$$x(-t) \overset{\mathcal{F}}{\longleftrightarrow} X(-j\omega)$$

which is still generally the same with

**Fourier series:**
$$x(-t) \overset{\text{F.S.}}{\longrightarrow} a_{-k}$$

Two indications(Also works with fourier series):

- If $x(t)$ is even, then $X(j\omega)$ is even, and vice versa.
- If $x(t)$ is odd, then $X(j\omega)$ is odd, and vice versa.

### Conjugacy & Symmetry

- Fourier transform: $\qquad \text{If } x(t) \overset{\mathcal{F}}{\longleftrightarrow} X(j\omega), \text{ then } x^*(t) \overset{\mathcal{F}}{\longleftrightarrow} X^*(-j\omega)$

which is also the same with

- Fourier series: $\qquad \text{If } x(t) \overset{\text{F.S.}}{\longrightarrow} a_k, \text{ then } x^*(t) \overset{\text{F.S.}}{\longrightarrow} a_{-k}^*$

- subcases

  - If $x(t)$ is real, $X(j\omega) = X^*(-j\omega)$ "conjugate symmetric". => Real part is even, and imaginary part is odd.
  - if $x(t)$ is real and even, $X(j\omega)$ is real and even
  - if $x(t)$ is real and odd, $X(j\omega)$ is imaginary and odd.

  - **A new indication not mentioned before:**

    - Since a real signal $x(t) = x_e(t) + x_o(t)$, $X(j\omega) = \mathcal{F}\{x_e(t)\} + \mathcal{F}\{x_o(t)\} =$ real spectrum + imaginary spectrum.
    - Meanwhile we also have $X(j\omega) = Re\{X(j\omega)\} + j \cdot Im\{X(j\omega)\}$. This means:

    $\qquad Re\{X(j\omega)\} = \mathcal{F}\{x_e(t)\}; \qquad jIm\{X(j\omega)\} = \mathcal{F}\{x_o(t)\};$

---

**below here the properties that start to change**

---

### Differentiation and Integration

- Differentiation property of Fourier transform:

  $$\text{If } x(t) \overset{\mathcal{F}}{\longleftrightarrow} X(\omega), \text{ then } \frac{dx(t)}{dt} \overset{\mathcal{F}}{\longleftrightarrow} j\omega X(\omega)$$

  - The same as for the Fourier series: If $x(t) \overset{\text{F.S.}}{\longrightarrow} a_k$, then

    $$\qquad \frac{dx(t)}{dt} \overset{\text{F.S.}}{\longrightarrow} jk\omega_0 a_k$$

  - Indication: differentiator is a highpass filter (non-ideal)

- Integration (**Different!**)

  - If $x(t) \overset{\mathcal{F}}{\longleftrightarrow} X(j\omega)$, then $\int_{-\infty}^{t} x(\tau)d\tau \overset{\mathcal{F}}{\longleftrightarrow} \frac{1}{j\omega}X(j\omega) + \pi X(j0)\delta(\omega)$

  - Fourier series: Suppose $x(t) \overset{\text{F.S.}}{\longrightarrow} a_k$, and $a_0 = 0$, then $\int_{-\infty}^{t} x(\tau)dt \overset{\text{F.S.}}{\longrightarrow} \frac{a_k}{jk\omega_0}$
  - Why this happens?
    ![alt text](/sigsys_1/image-13.png)
    so this is actually the same with the fourier series, but in series we can explicitly say $a_0$ = 0, but this is often not the case for fourier transform, so we have to add this term, which is actually the area under the curve.

### Parseval's Theorem

- Fourier transform

  - If $x(t) \leftrightarrow X(j\omega)$ then <br>
    $\int_{-\infty}^{\infty} |x(t)|^2 dt = \frac{1}{2\pi} \int_{-\infty}^{\infty} |X(j\omega)|^2 d\omega$

- Fourier series
  - Suppose $x(t) \overset{\text{F.S.}}{\longrightarrow} a_k$ <br>then $\frac{1}{T_0} \int_{T_0} |x(t)|^2 dt = \sum_{k=-\infty}^{\infty} |a_k|^2$

### Time scaling

- If $x(t) \overset{\mathcal{F}}{\longleftrightarrow} X(j\omega)$, then $x(at) \overset{\mathcal{F}}{\longleftrightarrow} \frac{1}{|a|}X(\frac{j\omega}{a})$ for any $a \in \mathbb{R}$ and $a \neq 0$.

  - If $|a| > 1$, $x(t)$ is squeezed to generate $x(at)$, $X(j\omega)$ is stretched and downward scaled to generate $\frac{1}{|a|}X(\frac{j\omega}{a})$.
  - If $|a| < 1$, $x(t)$ is stretched to generate $x(at)$, $X(j\omega)$ is squeezed and upward scaled to generate $\frac{1}{|a|}X(\frac{j\omega}{a})$.

- The scaling of the signal is opposite to the scaling of the spectrum.

  - Squeezing of signal causes faster variation, thus more high frequency components.
  - Stretching of signal causes slower variation, thus more low frequency components.

- E.g. $\text{rect}(t) \overset{\mathcal{F}}{\longleftrightarrow} 2\text{sinc}(\frac{\omega}{\pi}) \implies \text{rect}(\frac{t}{T_1}) \overset{\mathcal{F}}{\longleftrightarrow} 2|T_1|\text{sinc}(\frac{T_1\omega}{\pi})$, where $\text{rect}(t) = \begin{cases} 1; & |t| < 1 \\ 0; & \text{otherwise} \end{cases}$

### Duality

If $x(t) \overset{\mathcal{F}}{\longleftrightarrow} X(j\omega)$, then $X(t) \overset{\mathcal{F}}{\longleftrightarrow} 2\pi x(-j\omega)$, or $\frac{1}{2\pi}X(-t) \overset{\mathcal{F}}{\longleftrightarrow} x(j\omega)$

### Convolution

recall this
![alt text](/sigsys_1/image-6.png)

now we find that this so-called frequency response is the Fourier Transform of the impulse responce, from we can derive the convolution property:

$$\text{If } x(t) \stackrel{\mathcal{F}}{\longleftrightarrow} X(j\omega), y(t) \stackrel{\mathcal{F}}{\longleftrightarrow} Y(j\omega), \text{ then}$$

$$x(t) * y(t) \stackrel{\mathcal{F}}{\longleftrightarrow} X(j\omega)Y(j\omega)$$

**proof:**

$$
\begin{aligned}
\frac{1}{2\pi} \int_{-\infty}^{\infty} X(j\omega)Y(j\omega)e^{j\omega t} d\omega &= \frac{1}{2\pi} \int_{-\infty}^{\infty} \left[ \int_{-\infty}^{\infty} x(t_1)e^{-j\omega t_1} dt_1 \right] \left[ \int_{-\infty}^{\infty} y(t_2)e^{-j\omega t_2} dt_2 \right] e^{j\omega t} d\omega \\
&= \int_{-\infty}^{\infty} x(t_1) \left[ \int_{-\infty}^{\infty} y(t_2) \left( \frac{1}{2\pi} \int_{-\infty}^{\infty} e^{j\omega(t-t_1-t_2)} d\omega \right) dt_2 \right] dt_1 \\
&= \int_{-\infty}^{\infty} x(t_1) \left[ \int_{-\infty}^{\infty} y(t_2) \delta(t - t_1 - t_2) dt_2 \right] dt_1 \\
&= \int_{-\infty}^{\infty} x(t_1) y(t - t_1) dt_1 \\
&= x(t) * y(t)
\end{aligned}
$$

### Multipication

$$r(t) = s(t) \cdot p(t) \stackrel{\mathcal{F}}{\longleftrightarrow} R(\omega) = \frac{1}{2\pi} [S(\omega) * P(\omega)]$$

which is actually the duality of the convolution propertyy

## Predicting Outputs of a More Specific Systems

(This part is mainly based on the convolution property)

### Interconnected Systems

for two systems that has the frequency response of $H_1(j \omega)$ and $H_2(j \omega)$

**Cascaded Systems**

very easy, $H(j \omega) = H_1(j \omega)H_2(j \omega)$

**Parallel Systems**

still easy, $H(j \omega) = H_1(j \omega) + H_2(j \omega)$

**Feedback Systems**

where things get compilcated, take below as an example
![alt text](/sigsys_1/image-16.png)
$$Y(j \omega) = Z(j \omega) H_1(j \omega), \space Z(j \omega) = X(j \omega) - H_2(j \omega) Y(j \omega)$$

$$\text{plug the second into the first: } Y(j \omega) = (X(j \omega) - H_2(j \omega)Y(j \omega))H_1(j \omega)$$

$$=> H(j \omega) = \frac{Y(j \omega)}{X(j \omega)} = \frac{H_1(j \omega)}{1+ H_1(j \omega)H_2(j \omega)}$$

### LCCDE Systems

For the **LTI subsystem** of a **stable** LCCDE system
$$H(\omega) = \frac{Y(\omega)}{X(\omega)} = \frac{\sum_{k=0}^{M} b_k (j\omega)^k}{\sum_{k=0}^{N} a_k (j\omega)^k}$$

---

**Example:**
Find impulse response of

$$
\frac{d^2 y(t)}{dt^2} + 4 \frac{dy(t)}{dt} + 3y(t) = \frac{dx(t)}{dt} + 2x(t).
$$

Assuming the system is stable

$$
(j\omega)^2 Y(j\omega) + 4(j\omega)Y(j\omega) + 3Y(j\omega) = (j\omega)X(j\omega) + 2X(j\omega)
$$

$$
[(j\omega)^2 + 4j\omega + 3]Y(j\omega) = (j\omega + 2)X(j\omega)
$$

$$
H(j\omega) = \frac{Y(j\omega)}{X(j\omega)} = \frac{j\omega + 2}{(j\omega)^2 + 4j\omega + 3} \implies H(j\omega) = \frac{j\omega + 2}{(j\omega + 1)(j\omega + 3)}.
$$

---

![alt text](/sigsys_1/image-15.png)
![alt text](/sigsys_1/image-14.png)

## Time-Frequency Analysis of LTI/LCCDE Systems

### The Impact of Spectrums and Phases

The spectrum, or |H(j $\omega$)|, officially known as the gain of the system, changes the input spectrum by multiplication.
$$|Y(j\omega)| = |X(j\omega)||H(j\omega)|$$

$\angle H(j\omega)$, formally called phase shift of the system, affects the phase of the input spectrum by addition.
$$\angle Y(j\omega) = \angle X(j\omega) + \angle H(j\omega)$$

So we know that, if the phase is linear, it will delay the signal, which is something don't want.

And there is something we don't want more: if the phase is non-linear, then the delay for different frequencies will be different, causing distortions and errors.

![alt text](/sigsys_1/image-20.png)

### The Bode Plot

While the sepctrums/phases plots we drawn before seems good and straight forward, it is not used a lot in practice, where the filters might encounter frequencies at a very wide range, and the spectrum might also change in a very wide range, and the linear X, Y axis is not enough anymore, so we introduce the bode plot. It's still plots with frequencies as X-axis and spectrum/phase as the Y-axis, but instead of linear, it's log.

#### Bode Plot

The X-axis of a bode plot is in a log scale, that is the first tick is a, and the next tick is 10a, next 100a, 1000a and so on, an increase of 10 fold is called a decade. The Y-axis is in a 20log10 scale, and one unit in this scale is called a db, so the slope is described as xxdb/decade.

A very good thing of the spectrum bode plot is that it transforms the multiplication to addition, now, we just need to add the signal bode plot with the filter bode plot to get the result bode plot, much easier the multiplication.

And for the bode plot of phase, while the Y-axis keeps it's original phase, the X is in a log scale, like the spectrum bode plot.

![alt text](/sigsys_1/image-21.png)

#### Asymptotic Bode Plots

Unfortunately the exact bode plot, like the ripples on the turning points, are not easy to plot. So we introduce the asymptotic bode plots, it focuses more on the trend and not the details, for example:

$$H(j\omega) = \frac{1}{1+j \omega \tau}$$

- Spectrum: $20 \text{ lg}|H(j\omega)| = -10 \text{ lg}(1 + (\omega\tau)^2) \quad $
  - When $\omega \ll 1/\tau$, $(*)\approx -10 \text{ lg } 1 = 0$
  - When $\omega \gg 1/\tau$, $(*)\approx -20 \text{ lg}(\omega\tau) = -20 \text{ lg } \omega - 20 \text{ lg } \tau$, which is a straight line with a slope of -20dB/dec and a value of $0@\omega = 1/\tau$
- Phase: $\angle H(j \omega) = -\text{atan}(\omega \tau)$
  - When $\omega \approx 0.1/\tau$, $(**)\approx -\text{atan } 0.1 \approx 0$
  - When $\omega \approx 1/\tau$, $(**)\approx -\text{atan } 1 = -\frac{\pi}{4}$
  - When $\omega \approx 10/\tau$, $(**)\approx -\text{atan } 10 \approx -\frac{\pi}{2}$

so it looks like
![alt text](/sigsys_1/image-22.png)

#### How to Draw Asymptotic Bode Polts

(唉懒得装模做样说洋文了这段我就用中文说吧)

反正就是要拆成常数项和$(1+j \frac{\omega}{\omega_0})^{-1或1}$, 然后分子上的每一个$\omega_0$会从$\omega_0$开始给振幅图提供+20db/decade的斜率，给相位图从$0.1\omega_0 - 10\omega_0$提供$+\frac{\pi}{4}$/decade的斜率（如果有平方项就算两次以此类推）

分母上就都是负的

然后常数项若为K，在振幅上决定纵轴截距为$20\lg{|K|}$，在相位上就是正数的话无影响负数的话纵轴截距为$\pm \pi$

## Sample Theory

### Signal to Sample

![alt text](/sigsys_1/image-17.png)

$$p(t) = \sum_{n=-\infty}^{\infty} \delta(t-nT)$$
Where T is the sampling period, then

$$x_p(t) = x(t)p(t) = \sum_{-\infty}^{\infty} x(nT)\delta(t-nT)$$

where p(t) is called the sampling function, and 2$\pi$/T is called the sampling rate.

### Sampled Signals Analysis

first we can discuss about the specturm of the sampled signal, from the multiplication property we know that the spectrum of the signal:
$$X_{P} (j \omega) = \frac{1}{2 \pi} [X(j \omega) * P(j \omega)], P(j \omega) = \frac{2 \pi}{T} \delta(\omega - n \omega_s)$$
$$X_p(j\omega) = \ \frac{1}{T}\left[\sum_{n=-\infty}^{\infty} X(j\omega) * \delta(\omega - n\omega_s)\right] = \frac{1}{T}\sum_{n=-\infty}^{\infty} X(j(\omega - n \omega_s))$$

so, the sampled signal is a series of original shifted spectrum added up together.

Now, for simplicity, we assume that the original signal is banded-limited (from $-\omega_M$ to $\omega_M$), the sample spectrum are the original spectrum, and move it to $\omega_s$ left or right, and add it to the spectrum and so on.

If we are lucky, the gap is wide enough so there is no overlap, we will have a "spectrum" train, and we just apply a low pass filter to get one, and ift it to get the very original signal back.

But there are times we are not so lucky, where the gap is not that wide and there is an overlap, then spectrums start distorting each other, and now there is no way to recover it perfectly.

![alt text](/sigsys_1/image-18.png)

So we quantify the "gap" here and we get the Nyquist-Shannon Sampling Theorem:

Let $x(t)$ be any band-limited signal with $X(j\omega) = 0$ for $|\omega| > \omega_M$. Let $\{x(nT)|n \in \mathbb{Z}\}$ be a series of its periodic samples with a sampling frequency of $\omega_s = 2\pi/T$. If and only if $\omega_s > 2\omega_M$, $x(t)$ can be uniquely determined by its samples through the following process:

- Generate the impulse-train sampled signal: $x_p(t) \triangleq \sum_{n=-\infty}^{\infty} x(nT)\delta(t-nT) = x(t)\sum_{n=-\infty}^{\infty} \delta(t-nT)$
- Apply an ideal lowpass filter with a gain of $T$ and a cutoff frequency $\omega_M < \omega_c < \omega_s - \omega_M$. The output of the lowpass filter is $x(t)$

### ZOH sampling

In practice, we don't use impulses that often, we use a sort of sampling type called, zero-on-hold, aka sample-on-hold. Generally, instead of just having an impulse on the sample point, it will keep the value, until the next sample point, making a stair like sample result.

![alt text](/sigsys_1/image-19.png)

will this seems like a small change, it's not that beautiful in the frequency domain. First, we need to know that this is mathematically the impulse sample convolves with h(t), where $h(t) = 1 (0 < t < T), 0 \text{ for others}$, and the spectrum for h(t) is $H_0(j\omega) = \frac{2\text{Sin}(\omega T / 2)}{\omega}e^{-j\frac{\omega T}{2}}$, a nasty one!

so for this we have

$$X(j \omega) = X_p(j \omega)H_0(j \omega)$$

and we want

$$X(j \omega) = X_p(j \omega)H(j \omega)$$

where X_p is the impulse sample result, and H(j $\omega$) is a low pass filter (cutoff at $\omega_s$ / 2 for example)

from above we can see that we can use s "inverse filter" for H_0, which is possible:

$$H_r(j\omega) = \frac{H(j\omega)}{\frac{2\text{Sin}\omega T/2}{\omega}} \cdot e^{j\frac{\omega T}{2}}$$

### Aliasing

I can only explain it in an intuitive way. Let's consider the expected sampled spectrum as a 'true' specturm, and it's shifted mirrors, why we sample on a low frequency? Not because we want to get the low-pass part, what we really want to get is the 'true' part. And aliasing happens when the 'true' part actually is out of the filter range, but a 'fake' shifted mirror is captured in the sample range.

or just see 13:16-15:13 of this [video](https://open.163.com/newview/movie/free?pid=M8AROL7GG&mid=M8AS1TOO4)

Aliasing happens to a harmonic when the frequency of the harmonic $\omega_0$ is greater than $\frac{1}{2}\omega_s$. And the practical solution is to just cut off all the harmonics higher than half the sample rate before sampling.

### Digital to Analog

Digital signals are mostly discrete, and analog are mostly continuous, so we need to interpolate some data points into the digital signals' gaps before converting

Given a set of samples $f(nT), n \in \mathbb{Z}$, interpolation refers to
$$\hat{f}(t) = \left(\sum_{n=-\infty}^{\infty} f(nT)\delta(t-nT)\right) * h(t) = \sum_{n=-\infty}^{\infty} f(nT)h(t-nT)$$
where $h(t)$ is referred to as the **interpolation basis**

here we briefly introduces three types of interpolations:

- sinc interpolation: convolve the impulse sample with sinc function.
  - PROS: that's the perfect rebuilt theoretically, as sinc function is a low pass filter in the spectrum domain, and thats the very filter we want mentioned above.
  - CONS: convolution means you have to rebuild on the whole time scale, which is almost impossible in real life applications, this way of interpolation is only of theoretical significance.
- zero-order interpolations: pretty much like the reverse of ZOH sampling, the interpolation basis is like the h(t) above.
- first-order interpolations: connect discreate dots with a straight line, the interpolation basis is a trianglar funciton.

## Laplace Transform

Fourier is great...in most conditions, but there is a problem with the 1st Dirichlet condition, the signal must be absolutely integratable, which is not the case for all the signals/systems. Therefore we introduce the Lapalace Transform, which is actually like fourier transform expanded.

For an arbitrary signal $x(t)$,

$$X(s) = \mathcal{L}\{x(t)\} \triangleq \int_{-\infty}^{\infty} x(t)e^{-st} dt$$

is referred to as the Laplace transform of $x(t)$, where $s = \sigma + j\omega$ is a complex variable.

Fourier transform is a special case of Laplace transform when $\sigma = 0$ (i.e., on $j\omega$ axis in $s$-plane)

$$X(j\omega)=\int_{-\infty}^{\infty} x(t)e^{-j\omega t} dt$$

### ROC

(这后面是我暑假期间补写的, 所以我也不想演了, 用中文吧)
正如我们之前所提, 傅里叶变换的最大的问题就是对很多信号或者系统用不了, 所以我们引入了拉普拉斯变换, 其本质就是给函数补了一项 $e^{\sigma}$ , 让他本来可以不能用傅里叶了可以傅里叶了, 所以从图的角度来看本来傅里叶变换就是一条线变成了另一条线, 但是由于拉普拉斯加的这项额外引入了一个变量 $\sigma$ 所以就从一条线可以变换成很多(方向平行)的线, 组成了一个二维的面. 当然, 并不是所有的 $\sigma$ 都能让信号收敛, 能使其收敛的这部分的 $\sigma$ 取值就叫做收敛域(ROC, region of convergence)

#### 零极点图(Pole-zero plot)

如果我们想可视化拉普拉斯变换的光谱, 按照傅里叶变换的画法, 我们需要画一个凹凸不平的曲面, 虽然对电脑没问题, 但如果想手绘的话显然需要一些画工. 显然大部分时候我们都不需要所有 $\sigma$ 对应的拉普拉斯变换后的频谱, 我们可能更关心特殊情况, 比如什么时候是零点, 极值点, 这就可以用零极点图来表示, 也就是把所有的 $\sigma$ 取值画在一个平面上, 然后把对应的 $X(s)$ 的零点和极点标出来. 按照惯例我们把零点用圈圈, 极点用叉叉标s平面上标出来, 再用虚线和阴影标出可行域.

![alt text](/sigsys_1/image-23.png)

#### ROC的性质

1. **ROC的边界一定垂直于s平面的横轴(实轴), 即ROC一定是一个或者数个相互平行的竖直带状区域.**

   这是因为 $\sigma$ 是个实数

2. **ROC不包含极点**

   ROC是收敛域, 而显然, 极点并不收敛

3. **如果x(t)非零区间有上下限内非零或绝对可积, 则收敛域是整个s平面**

   即证 $\int_{T_1}^{T_2} |x(t)| dt < \infty$ 时, $\int_{T_1}^{T_2} |x(t)e^{-\sigma t}| dt < \infty$.

   即 $\int_{T_1}^{T_2} |x(t)e^{-\sigma t}|dt = \int_{T_1}^{T_2} |x(t)||e^{-\sigma t}|dt \le \max(|e^{-\sigma T_1}|, |e^{-\sigma T_2}|) \int_{T_1}^{T_2} |x(t)|dt < \infty$

4. **如果x(t)非零区间有下限, 则若 $\sigma_0$ 收敛, 则 $\forall \sigma > \sigma_0$ 也收敛**

   即ROC是一个右半平面

5. **如果x(t)非零区间有上限, 则若 $\sigma_0$ 收敛, 则 $\forall \sigma < \sigma_0$ 也收敛**

   性质4的镜像版

6. **如果拉普拉斯变换后的结果为有理函数, 则其ROC的边界要么为极点, 要么无限**

7. **如果x(t)的拉普拉斯变换后结果有理且存在ROC, 那么其满足:**
   - 若x(t)右半边非零, 则其收敛域左边界为最右侧极点, 右边界为无限
   - 若x(t)左半边非零, 则其收敛域右边界为最左侧极点, 左边界为无限
   - 若x(t)双边非零, 则其收敛域左右边界分别为两相邻极点

### 拉普拉斯逆变换

回顾拉普拉斯变换:

$$ X(s) = \int\_{-\infty}^{\infty} x(t)e^{-st} dt $$

由于我们之前提到过, 拉普拉斯变换的本质是把原函数偏移了一下的傅里叶变换, 即

$$ x(t) = e^{\sigma t} \mathscr{F}^{-1}\{X(\sigma+j\omega)\} \text{ for } \forall \sigma \in ROC $$

因此我们可以得到拉普拉斯逆变换为:

$$ x(t) = \frac{1}{2\pi j} \int\_{\sigma-j\infty}^{\sigma+j\infty} X(s)e^{st} ds $$

#### 计算拉普拉斯逆变换

硬算由于涉及含复数的积分, 比较困难, 对有理的拉普拉斯变换通常我们可以拆成一些已知的拉普拉斯变换对来进行逆变换的计算. 常见的包括

| Transform pair | Signal                         | Transform            | ROC                    |
| :------------- | :----------------------------- | :------------------- | :--------------------- |
| 1              | $\delta(t)$                    | $1$                  | All $s$                |
| 2              | $u(t)$                         | $\frac{1}{s}$        | $\Re e\{s\} > 0$       |
| 3              | $-u(-t)$                       | $\frac{1}{s}$        | $\Re e\{s\} < 0$       |
| 4              | $\frac{t^{n-1}}{(n-1)!}u(t)$   | $\frac{1}{s^n}$      | $\Re e\{s\} > 0$       |
| 5              | $-\frac{t^{n-1}}{(n-1)!}u(-t)$ | $\frac{1}{s^n}$      | $\Re e\{s\} < 0$       |
| 6              | $e^{-\alpha t}u(t)$            | $\frac{1}{s+\alpha}$ | $\Re e\{s\} > -\alpha$ |
| 7              | $-e^{-\alpha t}u(-t)$          | $\frac{1}{s+\alpha}$ | $\Re e\{s\} < -\alpha$ |

需要注意的就是即使变换后的结果相同, ROC不同, 原信号也可能完全不同.

### 拉普拉斯变换的性质

1. **线性**

   $x_1(t) \iff X_1(s)$, ROC: $R_1$, $x_2(t) \iff X_2(s)$, ROC: $R_2$ 时, 有

   $ax_1(t)+bx_2(t) \iff aX_1(s)+bX_2(s)$, ROC 包含(不一定相等) $R_1 \cap R_2$ , 例如, 可能ROC的边界是两个极点, 而这两个节点可能一正一副负刚好抵消, 这里这个边界就消除了, 让ROC扩大.

2. **时移**

   $x(t-t_0) \iff e^{-st_0}X(s)$, ROC 不变

3. **频移**

   $x(t) \iff X(s),$ ROC: $R$
   $x(t)e^{s_0 t} \iff X(s-s_0),$ ROC: $R + \Re e[s_0]$

4. **时域尺度变换**

   $x(at) \iff \frac{1}{|a|}X(\frac{s}{a})$, ROC: $R*a$

5. **共轭对称性**

   $x(t) \iff X(s)$, ROC: $R => x^*(t) \iff X^*(s^*)$, ROC: $R$

   由这个性质我们可以得到, 对于一个实信号, 其的零点和极点要么在横轴上, 要么关于横轴对称

6. **卷积性质**

   $x_1(t) \iff X_1(s)$, ROC : $R_1$, $x_2(t) \iff X_2(s)$, ROC : $R_2$ => $x_1(t)*x_2(t) \iff X_1(s)X_2(s)$ ROC 包含 $R_1 \cap R_2$

   当两个变换的极点和零点重合时, 可能会导致ROC的拓展

7. **时域微分**

   $\frac{dx(t)}{dt} \iff sX(s)$, ROC 包含原收敛域(当其在s=0处有一阶极点时ROC会扩大)

8. **s域微分**

   $x(t) \iff X(s)$, ROC: $R$, $-tx(t) \iff \frac{dX(s)}{ds}$, ROC: $R$

9. **时域积分**

   $\int_{-\infty}^{t} x(\tau)d\tau \iff \frac{1}{s}X(s)$, ROC: 包含 $R \cap \Re e\{s\} > 0$ (当且仅当X(s)在s=0处有零点时为包含)

10. **初值与终值定理**

    x(t)在t<0时恒为0且x(t)没有脉冲或更高阶奇点时满足

    - **初值定理**: $\lim_{t \to 0^+} x(t) = \lim_{s \to \infty} sX(s)$
    - **终值定理**: $\lim_{t \to \infty} x(t) = \lim_{s \to 0} sX(s)$ (x(t)在t->∞时收敛)

### 用拉普拉斯变换分析LTI系统

#### 传递函数

传递函数(aka系统函数)是指一个系统的脉冲响应的拉普拉斯变换, 由于卷积性质, 对任意信号都有 $Y(s) = H(s)X(s)$, 因此我们可以用传递函数来预测输.
$$H(s) = \frac{Y(s)}{X(s)} = \frac{\mathcal{L}\{y(t)\}}{\mathcal{L}\{x(t)\}}$$

#### 从拉普拉斯变换视角来分析LTI系统的性质

1. **因果性**:
   若一个LTI系统是因果的, 则其传递函数的ROC是一个右半平面. (对一般LTI倒过来说不成立)
   更进一步的, 如果LTI的传递函数是有理(可以表示为两个多项式只比)的, 则倒过来也成立了

2. **稳定性**:
   若一个LTI系统是稳定的, 则其ROC必须包含虚轴, 如果其同时还是因果的, 则说明其传递函数的极点都在左半平面内.
