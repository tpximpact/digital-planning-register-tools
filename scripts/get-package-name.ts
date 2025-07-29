const pkg = await Bun.file("package.json").json();
console.log(pkg.name);
