#!/usr/bin/env ruby

# frozen_string_literal: true

# Fails when a line or branch changed since the coverage baseline isn't covered by a test. Run it
# after Vitest writes `coverage/lcov.info`.

require "open3"

def run(*command)
  output, status = Open3.capture2(*command)
  abort "Error: The command `#{command.join(" ")}` failed." unless status.success?
  output
end

# The last commit before coverage was enforced.
baseline = "fc6b07da7bd2fe69221244678d8f720a2a9187fe"

# Maps each file in the lcov report to its lines that are unexecuted or have an untaken branch.
uncovered_lines = File.read("coverage/lcov.info").split("end_of_record").filter_map do |record|
  file = record[/^SF:(.+)$/, 1]
  next unless file

  lines = record.scan(/^DA:(\d+),0$/) + record.scan(/^BRDA:(\d+),\d+,\d+,(?:-|0)$/)
  [file, lines.flatten.map(&:to_i)]
end.to_h

# Maps each file to the line numbers added or changed since the baseline.
changed_lines = Hash.new { |hash, file| hash[file] = [] }
file = nil

run("git", "diff", "--unified=0", "--no-color", "--src-prefix=a/", "--dst-prefix=b/", baseline).each_line do |line|
  if (path = line[%r{^\+\+\+ b/(.+)$}, 1])
    file = path
  elsif (match = line.match(/^@@ -\S+ \+(\d+)(?:,(\d+))? @@/))
    start = match[1].to_i
    changed_lines[file].concat((start...(start + (match[2] || 1).to_i)).to_a)
  end
end

# Every line of an untracked file is new.
run("git", "ls-files", "--others", "--exclude-standard").split("\n").each do |path|
  changed_lines[path] = uncovered_lines[path] if uncovered_lines.key?(path)
end

failures = changed_lines.flat_map do |path, lines|
  (uncovered_lines.fetch(path, []) & lines).sort.map { |line| "#{path}:#{line}" }
end

unless failures.empty?
  abort "Error: These lines changed since the coverage baseline aren't covered by tests:\n" +
          failures.join("\n")
end

puts "Every line changed since the coverage baseline is covered."
