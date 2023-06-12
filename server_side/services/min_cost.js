
function createFlowNetwork(students, preferences, projectCapacities) {
  const numStudents = students.length;
  const numProjects = Object.keys(projectCapacities).length;
  const totalVertices = numStudents + numProjects + 2; // Students + Projects + Source + Sink

  // Initialize the graph with zero capacities
  const graph = Array.from({ length: totalVertices }, () =>
    Array(totalVertices).fill(0)
  );

  // Assign indices to students and projects
  const studentIndexMap = {};
  const projectIndexMap = {};
  let index = 1; // Start from index 1, leaving index 0 for source
  for (const student of students) {
    studentIndexMap[student] = index++;
  }
  for (const project of Object.keys(projectCapacities)) {
    projectIndexMap[project] = index++;
  }

  // Build the flow network
  for (const student of students) {
    const studentIndex = studentIndexMap[student];
    graph[0][studentIndex] = 1; // Connect source to students with capacity 1

    // Sort the preferences for each student by weight (descending order)
    preferences[student].sort((a, b) => b.weight - a.weight);

    for (const preference of preferences[student]) {
      const projectIndex = projectIndexMap[preference.project];
      graph[studentIndex][projectIndex] = preference.weight; // Assign weight to the edge
    }
  }

  for (const project of Object.keys(projectCapacities)) {
    const projectIndex = projectIndexMap[project];
    graph[projectIndex][totalVertices - 1] = projectCapacities[project]; // Connect projects to sink with project capacities
  }

  return graph;
}

function minCut(graph, source, sink, students, projects) {
    const rGraph = graph.map((row) => [...row]); // Create a copy of the graph for residual capacities
    const parent = Array(graph.length).fill(-1); // Parent array to store the augmented path
  
    while (bfs(rGraph, source, sink, parent)) {
      let pathFlow = Number.MAX_VALUE;
  
      // Find the minimum residual capacity along the path
      for (let v = sink; v !== source; v = parent[v]) {
        const u = parent[v];
        pathFlow = Math.min(pathFlow, rGraph[u][v]);
      }
  
      // Update residual capacities and reverse edges along the path
      for (let v = sink; v !== source; v = parent[v]) {
        const u = parent[v];
        rGraph[u][v] -= pathFlow;
        rGraph[v][u] += pathFlow;
      }
    }
  
    // Print the student-project assignments
    const assignments = [];
    for (let i = 1; i <= students.length; i++) {
      for (let j = students.length + 1; j <= students.length + projects.length; j++) {
        if (graph[i][j] > rGraph[i][j]) {
          // The student has been assigned to the project
          const studentIndex = i - 1;
          const projectIndex = j - students.length - 1;
          assignments.push({ student: students[studentIndex], project: projects[projectIndex] });
        }
      }
    }
  
    return assignments;
  }
  

  function bfs(rGraph, s, t, parent) {
    const visited = new Array(rGraph.length).fill(false);
    const maxFlow = new Array(rGraph.length).fill(0);
  
    let q = [];
    q.push(s);
    visited[s] = true;
    parent[s] = -1;
    maxFlow[s] = Number.MAX_VALUE;
  
    while (q.length) {
      let v = q.shift();
  
      for (let i = 0; i < rGraph.length; i++) {
        if (rGraph[v][i] > 0 && !visited[i]) {
          parent[i] = v;
          // Find minimum residual capacity of the edges along the path filled by BFS.
          maxFlow[i] = Math.min(maxFlow[v], rGraph[v][i]);
  
          if (i !== t) {
            q.push(i);
            visited[i] = true;
          } else {
            // If we have reached the sink node, return the max flow from source to sink
            return maxFlow[t];
          }
        }
      }
    }
  
    // No path found
    return 0;
  }
  

// A DFS based function to find all reachable
// vertices from s. The function marks visited[i]
// as true if i is reachable from s. The initial
// values in visited[] must be false. We can also
// use BFS to find reachable vertices
function dfs(rGraph, s, visited) {
  visited[s] = true;

  for (let i = 0; i < rGraph.length; i++) {
    if (rGraph[s][i] > 0 && !visited[i]) {
      dfs(rGraph, i, visited);
    }
  }
}

// Example usage
module.exports = { minCut, createFlowNetwork };