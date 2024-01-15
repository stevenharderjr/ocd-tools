# OCD Tools

A collection of tools for straightforward tasks that take up lots of time and attention when engaged in by certifiable perfectionists.

# Layout Equalizer

Plot equal spacing while accounting for padding and material width.

### Problem

I want to use ten equally spaced screws to attach an 12' rail, with the first and last screws falling two inches from the ends of the rail.

Subtracting the endpoint measurements involves converting the length to inches: **`144" - (2 * 2") = 140"`**

This needs to be divided by 9 (one less than the number of screws): **`140" / 9 = ~15.5_"`**

This doesn't divide evenly. My tape measure shows 1/8" intervals, so let's approximate 1/16" precision: **`140 / 9 * 16 = ~248.8_/16"`**

After reducing to feet and inches, my measurement intervals are as follows: `2"`, `1' 5 9/16"`, `2' 9 1/8"`, `4' 11/16"`, `5' 4 1/4"`, `6' 7 3/4"`, `7' 9 5/16"`, `9' 2 7/8"`, `10' 6 7/16"`, `11' 10"`

# Ratioizer

Keeps sets of values and allows dynamic adjustments without changing proportions between them.

For example, my nominal cup of coffee comprises 20g sugar, 200ml coffee, and 150ml half & half.
Now let's say I want to modify the amount of an ingredient or target a total serving size without changing the flavor.

### Problem

If I'm short on half & half, I can use the ratio between the available amount (128 ml) and the nominal amount (150 ml).

- R = 128/150 **(~0.85)**

- **~170 ml Coffee** (200\*R)

- **~17 g Sugar** (20\*R)

### Problem

If I want to fill a larger cup, I can use the ratio between the capacity of the cup (440 ml) and the sum of the nominal values (370 ml).

R = 370/440 **(~1.19)**

- **~238 ml Coffee** (200\*R)

- **~178 ml Half & Half** (150\*R)

- **~24 g Sugar** (20\*R)
