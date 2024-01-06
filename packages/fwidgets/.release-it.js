const commitPartial = `- {{#if subject}}
  {{~subject}}
{{~else}}
  {{~header}}
{{~/if}}

{{~!-- commit link --}}{{~#if hash}} {{#if @root.linkReferences~}}
  ([{{shortHash}}]({{~@root.host}}/{{~@root.owner}}/{{~@root.repository}}/commit/{{hash}}))
{{~else}}
  {{~shortHash}}
{{~/if}}{{~/if}}

{{~!-- commit references --}}
{{~#if references~}}
  , closes
  {{~#each references}} {{#if @root.linkReferences~}}
    [
    {{~#if this.owner}}
      {{~this.owner}}/
    {{~/if}}
    {{~this.repository}}{{this.prefix}}{{this.issue}}]({{~@root.host}}/{{~@root.owner}}/{{~@root.repository}}/issues/{{id}})
  {{~else}}
    {{~#if this.owner}}
      {{~this.owner}}/
    {{~/if}}
    {{~this.repository}}{{this.prefix}}{{this.issue}}
  {{~/if}}{{/each}}
{{~/if}}

`;

module.exports = {
	github: {
		release: true
	},
	plugins: {
		"@release-it/conventional-changelog": {
			preset: {
				name: "conventionalcommits",
				types: [
					{
						type: "feat",
						section: "Features",
						scope: "fw"
					},
					{
						type: "fix",
						section: "Fixes",
						scope: "fw"
					},
					{
						type: "chore",
						section: "Chores",
						scope: "fw"
					},
					{
						type: "ci",
						section: "CI/CD",
						scope: "fw"
					}
				]
			},
			infile: "../../CHANGELOG.md",
			header: "# Changelog",
			ignoreRecommendedBump: true,
			writerOpts: {
				commitPartial
			}
		}
	}
};
