# Commit
> Create a commit with GitHub Actions

## :warning: Warning
This action is still in development and the experience is subject to change. Use at your own risk.

## About
This action allows you to create a commit with GitHub Actions. Commits created with this aciton will be marked as _verified_.

![image](https://user-images.githubusercontent.com/27806/101197362-a2ed0980-3627-11eb-9afb-bc8b9bcd0345.png)

## Usage
In your workflow, to commit a file `./myfile`, include a step like this:

```yaml
    - name: Commit file
      uses: swinton/commit@v1
      env:
        GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        path: ./myfile
        commit-message: Committing ./myfile
```

Note, the `GH_TOKEN` environment variable is _required_, since commits are created using GitHub's [Git Database API](https://docs.github.com/rest/reference/git).

## Inputs
The following inputs are _required_:

- `path`: Filesystem path of file to be committed, e.g. `Add ./myfile`
- `commit-message`: Commit message to be used, e.g. `./myfile`

## Outputs
This action provides the following outputs:

- `commit-sha`: SHA of created commit
