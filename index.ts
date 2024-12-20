console.log("FML!");
import * as core from "@actions/core";

core.info("index.ts");

import getInput from "./lib/input";
import { Repo } from "./lib/repo";
import { Ref } from "./lib/ref";
import { getBlobsFromFiles } from "./lib/blob";
import { Tree } from "./lib/tree";
import { Commit } from "./lib/commit";

export default async function run(): Promise<void> {
	core.debug("index.ts run");
	try {
		// Get repo
		core.debug("GITHUB_REPOSITORY:" + process.env.GITHUB_REPOSITORY);
		const repo = new Repo(process.env.GITHUB_REPOSITORY);
		await repo.load();
		core.debug("repo loaded");

		// Get inputs
		const files = getInput("files");
		const baseDir = getInput("workspace", {
			default: process.env.GITHUB_WORKSPACE,
		});
		const commitMessage = getInput("commit-message");

		// Load ref details
		const ref = new Ref(repo, getInput("ref", { default: repo.defaultBranchRef }));

		await ref.load();
		core.debug("ref loaded");

		// Expand files to an array of "blobs", which will be created on GitHub via the create blob API
		const blobs = getBlobsFromFiles(repo, files, { baseDir });
		core.debug(
			`Received ${blobs.length} blob${blobs.length === 1 ? "" : "s"}: ${blobs
				.map((blob) => blob.absoluteFilePath)
				.join(", ")}`
		);

		// Create a tree
		const tree: Tree = new Tree(repo, blobs, ref.treeOid);

		// Create commit
		const commit: Commit = new Commit(repo, tree, commitMessage, [ref.commitOid]);
		await commit.save();

		// Set commit sha output
		core.setOutput("commit-sha", commit.sha);

		// Update ref to point at new commit sha
		await ref.update(commit.sha);
	} catch (e) {
		core.setFailed(e);
	}
}

run();
