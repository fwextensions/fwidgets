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
const tagName = "create-fwidgets@${version}";

module.exports = {
	git: {
		commitMessage: `Release ${tagName}`,
		tagName
	},
	github: {
		releaseName: `Release ${tagName}`,
		release: false
	},
	plugins: {
		"@release-it/conventional-changelog": {
			preset: {
				name: "conventionalcommits",
				types: [
					{
						type: "feat",
						section: "Features",
						scope: "cf"
					},
					{
						type: "fix",
						section: "Fixes",
						scope: "cf"
					},
					{
						type: "chore",
						section: "Chores",
						scope: "cf"
					},
					{
						type: "ci",
						section: "CI/CD",
						scope: "cf"
					}
				]
			},
			infile: "CHANGELOG.md",
			header: "# Changelog",
			ignoreRecommendedBump: true,
			writerOpts: {
				commitPartial
			}
		}
	}
};
