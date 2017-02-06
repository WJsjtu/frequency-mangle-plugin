var RawSource = require("webpack-sources").RawSource;
var ModuleFilenameHelpers = require("webpack/lib/ModuleFilenameHelpers");
var FrequencyMangle = require("frequency-mangle");

var FrequencyManglePlugin = function (options) {
    this.options = options || {};
};

FrequencyManglePlugin.prototype.apply = function (compiler) {
    var options = this.options;
    options.test = options.test || /\.js$/i;

    compiler.plugin("compilation", function (compilation) {
        compilation.plugin("optimize-chunk-assets", function (chunks, callback) {

            var files = [];
            chunks.forEach(function (chunk) {
                files.push.apply(files, chunk.files);
            });
            files.push.apply(files, compilation.additionalChunkAssets);
            files = files.filter(ModuleFilenameHelpers.matchObject.bind(undefined, options));

            files.forEach(function (file) {
                var asset = compilation.assets[file];
                var input = asset.source();

                var output = FrequencyMangle.mangle(input, options);

                if (output) {
                    compilation.assets[file] = new RawSource(output);
                }
            });

            callback();
        });
    });
};

module.exports = FrequencyManglePlugin;
