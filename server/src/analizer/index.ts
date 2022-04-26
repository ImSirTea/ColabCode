import { ASTBranch, ASTBranchFrequencies } from '@/types';

/**
 * Finds the modal average branch from the given branches.
 * @param branchList A list of branches to compare
 * @returns A group of branches all with the most common type
 */
export function getAverage(branchList: (ASTBranch | undefined)[]) {
  // Build a frequency list for all the branches
  const frequencies: ASTBranchFrequencies = {};
  branchList.forEach((branch) => {
    const typeName = (branch === undefined) ? 'Undefined' : branch.type;
    if (!frequencies[typeName]) {
      frequencies[typeName] = {
        type: typeName,
        amount: 0,
        branches: [],
      };
    }
    frequencies[typeName].amount += 1;
    frequencies[typeName].branches.push(branch);
  });

  // Find the most common type of branch
  const modalAverage = Object.keys(frequencies)
    .reduce((a, b) => (frequencies[a].amount > frequencies[b].amount ? a : b));

  return frequencies[modalAverage];
}
