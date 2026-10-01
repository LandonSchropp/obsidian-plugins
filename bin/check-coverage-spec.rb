# frozen_string_literal: true

require "bundler/inline"

gemfile do
  source "https://rubygems.org"
  gem "rspec", "~> 3.13"
end

require "rspec/autorun"
require "fileutils"
require "open3"
require "tmpdir"

SCRIPT = File.expand_path("check-coverage.rb", __dir__)

RSpec.describe "check-coverage" do
  let(:main) { TOPLEVEL_BINDING.receiver }
  let(:diff) { "" }
  let(:untracked_files) { "" }

  def run_script
    load SCRIPT
  end

  around do |example|
    Dir.mktmpdir { |directory| Dir.chdir(directory) { example.run } }
  end

  before do
    FileUtils.mkdir_p("coverage")

    File.write("coverage/lcov.info", <<~LCOV)
      TN:
      SF:shared/string.ts
      DA:1,1
      DA:2,0
      DA:3,1
      BRDA:3,0,0,1
      BRDA:3,0,1,0
      end_of_record
    LCOV

    allow(Open3).to receive(:capture2).with("git", "diff", any_args).and_return([diff, success])
    allow(Open3).to receive(:capture2).with("git", "ls-files", any_args).and_return([untracked_files, success])
    allow($stdout).to receive(:write)
  end

  let(:success) { instance_double(Process::Status, success?: true) }

  context "when every changed line is covered" do
    let(:diff) { "+++ b/shared/string.ts\n@@ -1,0 +1,1 @@\n" }

    it "reports success" do
      expect { run_script }.to output(/is covered/).to_stdout
    end
  end

  context "when a hunk only deletes lines" do
    let(:diff) { "+++ b/shared/string.ts\n@@ -2,4 +1,0 @@\n" }

    it "reports success" do
      expect { run_script }.to output(/is covered/).to_stdout
    end
  end

  context "when a changed file has no coverage data" do
    let(:diff) { "+++ b/README.md\n@@ -1,0 +1,2 @@\n" }

    it "reports success" do
      expect { run_script }.to output(/is covered/).to_stdout
    end
  end

  context "when a changed line is not covered" do
    let(:diff) { "+++ b/shared/string.ts\n@@ -2 +2 @@\n" }

    it "lists the line and fails" do
      expect { run_script }.to raise_error(SystemExit).and output(%r{^shared/string\.ts:2$}).to_stderr
    end
  end

  context "when a changed line has an untaken branch" do
    let(:diff) { "+++ b/shared/string.ts\n@@ -3 +3 @@\n" }

    it "lists the line and fails" do
      expect { run_script }.to raise_error(SystemExit).and output(%r{^shared/string\.ts:3$}).to_stderr
    end
  end

  context "when an untracked file has an uncovered line" do
    let(:untracked_files) { "shared/new.ts\n" }

    before do
      File.write("coverage/lcov.info", "SF:shared/new.ts\nDA:2,0\nend_of_record\n", mode: "a")
    end

    it "lists the line and fails" do
      expect { run_script }.to raise_error(SystemExit).and output(%r{^shared/new\.ts:2$}).to_stderr
    end
  end

  context "when the diff spans several files" do
    let(:diff) { "+++ b/README.md\n@@ -1,0 +1,2 @@\n+++ b/shared/string.ts\n@@ -2 +2 @@\n" }

    it "lists the uncovered line in the later file" do
      expect { run_script }.to raise_error(SystemExit).and output(%r{^shared/string\.ts:2$}).to_stderr
    end
  end

  context "when a git command fails" do
    before do
      failure = instance_double(Process::Status, success?: false)
      allow(Open3).to receive(:capture2).with("git", "diff", any_args).and_return(["", failure])
    end

    it "fails with an error" do
      expect { run_script }.to raise_error(SystemExit).and output(/^Error: The command `git diff/).to_stderr
    end
  end
end
