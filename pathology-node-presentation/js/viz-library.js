/* ============================================================
   Lecture Visualization Library — D3.js visualizations
   Each function takes a container DOM element and optional config
   ============================================================ */

const VizLibrary = (function () {

    // ─── WORKFLOW PIPELINE (three-phase) ─────────────────────
    function workflowPipeline(container, config) {
        var W = 1050, H = 340;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var phases = (config && config.phases) || [
            { label: 'Pre-Analytical', color: '#3498db',
              steps: ['Order', 'Collection', 'Labeling', 'Accessioning'] },
            { label: 'Analytical', color: '#27ae60',
              steps: ['Grossing', 'Processing', 'Slide Creation', 'Staining'] },
            { label: 'Post-Analytical', color: '#9b59b6',
              steps: ['Interpretation', 'Reporting', 'Distribution', 'Follow-up'] }
        ];

        var phaseW = 330, gap = 24, stepH = 36, stepGap = 8;
        var stepW = phaseW - 30;

        phases.forEach(function (phase, pi) {
            var px = pi * (phaseW + gap) + 12;
            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', px).attr('y', 0)
                .attr('width', phaseW).attr('height', H - 10)
                .attr('rx', 12).attr('fill', phase.color).attr('fill-opacity', 0.08)
                .attr('stroke', phase.color).attr('stroke-opacity', 0.3).attr('stroke-width', 1.5);

            g.append('text').attr('x', px + phaseW / 2).attr('y', 30)
                .attr('text-anchor', 'middle').attr('font-size', '15px')
                .attr('font-weight', '700').attr('fill', phase.color)
                .text(phase.label);

            phase.steps.forEach(function (step, si) {
                var sx = px + 15;
                var sy = 50 + si * (stepH + stepGap);

                g.append('rect').attr('x', sx).attr('y', sy)
                    .attr('width', stepW).attr('height', stepH)
                    .attr('rx', 8).attr('fill', 'white')
                    .attr('stroke', phase.color).attr('stroke-width', 1.5);

                g.append('text').attr('x', sx + stepW / 2).attr('y', sy + stepH / 2 + 5)
                    .attr('text-anchor', 'middle').attr('font-size', '13px')
                    .attr('fill', '#0e6e8c').text(step);

                if (si < phase.steps.length - 1) {
                    var ay = sy + stepH + 2;
                    g.append('path')
                        .attr('d', 'M' + (sx + stepW / 2 - 5) + ',' + ay +
                              ' L' + (sx + stepW / 2) + ',' + (ay + stepGap - 2) +
                              ' L' + (sx + stepW / 2 + 5) + ',' + ay)
                        .attr('fill', phase.color).attr('opacity', 0.5);
                }
            });

            g.transition().delay(pi * 400).duration(600).style('opacity', 1);
        });

        for (var i = 0; i < 2; i++) {
            var ax = (i + 1) * (phaseW + gap) - gap / 2 + 12;
            svg.append('text').attr('x', ax).attr('y', H / 2)
                .attr('text-anchor', 'middle').attr('font-size', '24px')
                .attr('fill', '#bdc3c7').text('\u2192')
                .style('opacity', 0)
                .transition().delay(800 + i * 300).duration(400).style('opacity', 1);
        }
    }

    // ─── ABSTRACTION LAYERS (car analogy) ────────────────────
    function abstractionLayers(container, config) {
        var W = 1000, H = 420;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var layerH = 56, gap = 10, colW = 420;
        var topStart = 44;                          // y where layer boxes begin
        var topEnd = topStart + 2 * layerH + gap;   // bottom of 2nd layer box
        var annotY = topEnd + 26;                    // "FOCUS HERE" text baseline
        var botStart = annotY + 18;                  // top of 3rd layer box

        var carLayers = [
            { label: 'Driver', sub: 'Where you want to go, how fast', color: '#2980b9' },
            { label: 'Controls', sub: 'Steering, pedals, dashboard', color: '#3498db' },
            { label: 'Drivetrain', sub: 'Engine, transmission, electronics', color: '#5dade2' },
            { label: 'Components', sub: 'Chips, sensors, fuel injectors', color: '#85c1e9' }
        ];
        var pathLayers = [
            { label: 'Pathologist', sub: 'Diagnosis, workflow decisions', color: '#27ae60' },
            { label: 'Workflow & Logic', sub: 'Rules, validations, distribution', color: '#2ecc71' },
            { label: 'Systems', sub: 'LIS, viewers, interfaces, middleware', color: '#58d68d' },
            { label: 'Infrastructure', sub: 'Servers, CPUs, networks, storage', color: '#82e0aa' }
        ];

        // Focus bracket — covers the top two layers
        var bracketTop = topStart - 8;
        var bracketH = topEnd - bracketTop + 8;
        svg.append('rect').attr('x', 0).attr('y', bracketTop)
            .attr('width', W).attr('height', bracketH)
            .attr('rx', 14).attr('fill', 'rgba(41,128,185,0.06)')
            .attr('stroke', '#2980b9').attr('stroke-dasharray', '6,4')
            .attr('stroke-width', 1.5);

        // Annotation line + text between top and bottom layers
        svg.append('line')
            .attr('x1', 40).attr('x2', W - 40)
            .attr('y1', annotY - 10).attr('y2', annotY - 10)
            .attr('stroke', '#2980b9').attr('stroke-width', 1)
            .attr('stroke-dasharray', '4,3').attr('opacity', 0.5);

        svg.append('text').attr('x', W / 2).attr('y', annotY + 4)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#2980b9').attr('font-weight', '600')
            .text('\u25B2 FOCUS HERE \u2014 the abstraction layers that matter for clinical practice');

        function drawCol(layers, xOff, title, emoji) {
            var g = svg.append('g');
            g.append('text').attr('x', xOff + colW / 2).attr('y', 28)
                .attr('text-anchor', 'middle').attr('font-size', '15px')
                .attr('font-weight', '700').attr('fill', '#0e6e8c')
                .text(emoji + '  ' + title);

            layers.forEach(function (layer, i) {
                // Top 2 layers above annotation, bottom 2 below
                var y = i < 2
                    ? topStart + i * (layerH + gap)
                    : botStart + (i - 2) * (layerH + gap);

                var lg = g.append('g').style('opacity', 0);

                lg.append('rect').attr('x', xOff).attr('y', y)
                    .attr('width', colW).attr('height', layerH)
                    .attr('rx', 10).attr('fill', layer.color).attr('fill-opacity', 0.15)
                    .attr('stroke', layer.color).attr('stroke-width', 2);

                lg.append('text').attr('x', xOff + 18).attr('y', y + 24)
                    .attr('font-size', '15px').attr('font-weight', '700')
                    .attr('fill', layer.color).text(layer.label);

                lg.append('text').attr('x', xOff + 18).attr('y', y + 43)
                    .attr('font-size', '12px').attr('fill', '#555').text(layer.sub);

                var targetOpacity = i < 2 ? 1.0 : 0.35;
                lg.transition().delay(i * 250 + 200).duration(500).style('opacity', targetOpacity);
            });
        }

        drawCol(carLayers, 20, 'Driving a Car', '\uD83D\uDE97');
        drawCol(pathLayers, W - colW - 20, 'Practicing Pathology', '\uD83D\uDD2C');

        // Equivalence symbol between columns (vertically centered on top layers)
        var eqY = topStart + layerH + gap / 2;
        svg.append('text').attr('x', W / 2).attr('y', eqY + 6)
            .attr('text-anchor', 'middle').attr('font-size', '30px')
            .attr('fill', '#bdc3c7').text('\u2248');
    }

    // ─── SYSTEMS ECOSYSTEM ───────────────────────────────────
    function systemsEcosystem(container, config) {
        var W = 950, H = 420;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var nodes = [
            { id: 'LIS', label: 'LIS', r: 44, color: '#2980b9' },
            { id: 'scanners', label: 'Instrument\nInterfaces', r: 30, color: '#27ae60' },
            { id: 'imaging', label: 'Image Mgmt\n/ Viewer', r: 30, color: '#8e44ad' },
            { id: 'dictation', label: 'Dictation &\nReporting', r: 30, color: '#e67e22' },
            { id: 'middleware', label: 'Middleware', r: 28, color: '#16a085' },
            { id: 'portals', label: 'Portals /\nDashboards', r: 28, color: '#2c3e50' },
            { id: 'warehouse', label: 'Data\nWarehouse', r: 30, color: '#c0392b' },
            { id: 'messaging', label: 'Messaging /\nNotifications', r: 28, color: '#f39c12' },
            { id: 'ai', label: 'AI / ML\nModels', r: 28, color: '#e74c3c' }
        ];

        var links = [
            { source: 'LIS', target: 'scanners' },
            { source: 'LIS', target: 'imaging' },
            { source: 'LIS', target: 'dictation' },
            { source: 'LIS', target: 'middleware' },
            { source: 'LIS', target: 'portals' },
            { source: 'LIS', target: 'warehouse' },
            { source: 'LIS', target: 'messaging' },
            { source: 'LIS', target: 'ai' },
            { source: 'imaging', target: 'ai' },
            { source: 'warehouse', target: 'ai' },
            { source: 'middleware', target: 'scanners' }
        ];

        var cx = W / 2, cy = H / 2, radius = 170;
        nodes[0].x = cx; nodes[0].y = cy;
        var outer = nodes.slice(1);
        outer.forEach(function (n, i) {
            var angle = (i / outer.length) * 2 * Math.PI - Math.PI / 2;
            n.x = cx + radius * Math.cos(angle);
            n.y = cy + radius * Math.sin(angle);
        });

        var nodeMap = {};
        nodes.forEach(function (n) { nodeMap[n.id] = n; });

        svg.selectAll('.eco-link')
            .data(links).enter()
            .append('line')
            .attr('x1', function (d) { return nodeMap[d.source].x; })
            .attr('y1', function (d) { return nodeMap[d.source].y; })
            .attr('x2', function (d) { return nodeMap[d.target].x; })
            .attr('y2', function (d) { return nodeMap[d.target].y; })
            .attr('stroke', '#bdc3c7').attr('stroke-width', 2)
            .style('opacity', 0)
            .transition().delay(function (d, i) { return 300 + i * 80; }).duration(400)
            .style('opacity', 0.4);

        var nodeGs = svg.selectAll('.eco-node')
            .data(nodes).enter()
            .append('g')
            .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; })
            .style('opacity', 0);

        nodeGs.append('circle')
            .attr('r', function (d) { return d.r; })
            .attr('fill', function (d) { return d.color; }).attr('fill-opacity', 0.15)
            .attr('stroke', function (d) { return d.color; }).attr('stroke-width', 2.5);

        nodeGs.each(function (d) {
            var lines = d.label.split('\n');
            var g = d3.select(this);
            lines.forEach(function (line, i) {
                g.append('text')
                    .attr('y', (i - (lines.length - 1) / 2) * 13 + 4)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', d.id === 'LIS' ? '16px' : '10px')
                    .attr('font-weight', d.id === 'LIS' ? '800' : '600')
                    .attr('fill', d.color)
                    .text(line);
            });
        });

        nodeGs.transition().delay(function (d, i) { return i * 150; }).duration(500)
            .style('opacity', 1);
    }

    // ─── AI MATURITY LADDER ──────────────────────────────────
    function aiMaturityLadder(container, config) {
        var W = 950, H = 360;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var levels = [
            { label: 'Level IV: Integrated Decision Support', sub: 'Differential generation, risk stratification', color: '#8e44ad', icon: '\uD83E\uDDE0' },
            { label: 'Level III: Assistive AI', sub: 'Flagging, quantification, draft reports', color: '#e74c3c', icon: '\uD83E\uDD16' },
            { label: 'Level II: Real-time QA & Safety', sub: 'Mismatch detection, missing fields, hard stops', color: '#f39c12', icon: '\uD83D\uDEE1\uFE0F' },
            { label: 'Level I: Retrospective Analytics', sub: 'TAT reports, volumes, trends', color: '#27ae60', icon: '\uD83D\uDCCA' }
        ];

        var stepH = 68, baseW = 860, narrowing = 100;

        levels.forEach(function (level, i) {
            var w = baseW - i * narrowing;
            var x = (W - w) / 2;
            var y = H - (levels.length - i) * (stepH + 6);

            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', x).attr('y', y)
                .attr('width', w).attr('height', stepH)
                .attr('rx', 10).attr('fill', level.color).attr('fill-opacity', 0.12)
                .attr('stroke', level.color).attr('stroke-width', 2);

            g.append('text').attr('x', x + 44).attr('y', y + 30)
                .attr('font-size', '14px').attr('font-weight', '700')
                .attr('fill', level.color).text(level.label);

            g.append('text').attr('x', x + 44).attr('y', y + 50)
                .attr('font-size', '11px').attr('fill', '#555').text(level.sub);

            g.append('text').attr('x', x + 18).attr('y', y + 40)
                .attr('font-size', '20px').text(level.icon);

            g.transition().delay((levels.length - 1 - i) * 350).duration(500).style('opacity', 1);
        });
    }

    // ─── DATA FLOW PIPELINE ──────────────────────────────────
    function dataFlow(container, config) {
        var W = 1000, H = 160;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var steps = ['Capture', 'Map', 'Store', 'Clean', 'Present', 'Interpret', 'Act'];
        var colors = ['#3498db', '#2980b9', '#1abc9c', '#27ae60', '#f39c12', '#e67e22', '#e74c3c'];
        var stepW = 110, gapX = 18;
        var startX = (W - steps.length * (stepW + gapX) + gapX) / 2;

        steps.forEach(function (step, i) {
            var x = startX + i * (stepW + gapX);
            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', x).attr('y', 30)
                .attr('width', stepW).attr('height', 50)
                .attr('rx', 10).attr('fill', colors[i]).attr('fill-opacity', 0.15)
                .attr('stroke', colors[i]).attr('stroke-width', 2);

            g.append('text').attr('x', x + stepW / 2).attr('y', 60)
                .attr('text-anchor', 'middle').attr('font-size', '13px')
                .attr('font-weight', '600').attr('fill', colors[i]).text(step);

            if (i < steps.length - 1) {
                g.append('text').attr('x', x + stepW + gapX / 2).attr('y', 60)
                    .attr('text-anchor', 'middle').attr('font-size', '18px')
                    .attr('fill', '#bdc3c7').text('\u2192');
            }

            if (i > 0 && i < steps.length - 1) {
                g.append('text').attr('x', x - gapX / 2).attr('y', 105)
                    .attr('text-anchor', 'middle').attr('font-size', '9px')
                    .attr('fill', '#e74c3c').attr('font-weight', '600').text('\u26A0 interface');
            }

            g.transition().delay(i * 180).duration(400).style('opacity', 1);
        });

        svg.append('text').attr('x', W / 2).attr('y', 140)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#e74c3c').attr('font-style', 'italic')
            .text('Failures cluster at interfaces, not in isolated steps');
    }

    // ─── AUTOMATION MATURITY LADDER ──────────────────────────
    function automationLadder(container, config) {
        var W = 900, H = 260;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var levels = [
            { label: 'Level III: Guidance', sub: 'Dynamic worklists, exception triage, "falling behind" detection', color: '#8e44ad' },
            { label: 'Level II: Prevention', sub: 'Constraints + safety checks (prevent known harms)', color: '#f39c12' },
            { label: 'Level I: Tracking', sub: 'Audit events (what happened, when)', color: '#27ae60' }
        ];

        var stepH = 58, baseW = 800, narrowing = 120;

        levels.forEach(function (level, i) {
            var w = baseW - i * narrowing;
            var x = (W - w) / 2;
            var y = H - (levels.length - i) * (stepH + 8);

            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', x).attr('y', y)
                .attr('width', w).attr('height', stepH)
                .attr('rx', 10).attr('fill', level.color).attr('fill-opacity', 0.12)
                .attr('stroke', level.color).attr('stroke-width', 2);

            g.append('text').attr('x', x + 18).attr('y', y + 25)
                .attr('font-size', '14px').attr('font-weight', '700')
                .attr('fill', level.color).text(level.label);

            g.append('text').attr('x', x + 18).attr('y', y + 45)
                .attr('font-size', '11px').attr('fill', '#555').text(level.sub);

            g.transition().delay((levels.length - 1 - i) * 350).duration(500).style('opacity', 1);
        });
    }

    // ─── PHASE COMPARISON (CP ✓ vs AP ?) ─────────────────────
    function phaseComparison(container, config) {
        var W = 1060, H = 380;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var colW = 500, gap = 60;
        var phaseW = 150, phaseH = 260, phaseGap = 10;
        var colors = ['#3498db', '#27ae60', '#9b59b6'];
        var phaseLabels = ['Pre-Analytical', 'Analytical', 'Post-Analytical'];

        // ── LEFT: Clinical Chemistry (clean) ──
        var lx = 0;
        var lg = svg.append('g').style('opacity', 0);
        lg.append('text').attr('x', lx + colW / 2).attr('y', 24)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('font-weight', '700').attr('fill', '#0e6e8c')
            .text('Clinical Chemistry  ✓');

        var cpSteps = [
            ['Order entry', 'Collection', 'Transport', 'Accessioning'],
            ['Instrument analysis', '(single automated step)'],
            ['Result review', 'Reporting', 'Distribution']
        ];

        phaseLabels.forEach(function (label, pi) {
            var px = lx + pi * (phaseW + phaseGap) + 20;
            lg.append('rect').attr('x', px).attr('y', 40)
                .attr('width', phaseW).attr('height', phaseH)
                .attr('rx', 10).attr('fill', colors[pi]).attr('fill-opacity', 0.08)
                .attr('stroke', colors[pi]).attr('stroke-opacity', 0.4).attr('stroke-width', 1.5);

            lg.append('text').attr('x', px + phaseW / 2).attr('y', 62)
                .attr('text-anchor', 'middle').attr('font-size', '11px')
                .attr('font-weight', '700').attr('fill', colors[pi]).text(label);

            cpSteps[pi].forEach(function (step, si) {
                lg.append('text').attr('x', px + phaseW / 2).attr('y', 88 + si * 22)
                    .attr('text-anchor', 'middle').attr('font-size', '11px')
                    .attr('fill', '#555').text(step);
            });
        });

        // Clean dividers between phases
        for (var di = 0; di < 2; di++) {
            var dx = lx + (di + 1) * (phaseW + phaseGap) + 20 - phaseGap / 2;
            lg.append('text').attr('x', dx).attr('y', 170)
                .attr('text-anchor', 'middle').attr('font-size', '18px')
                .attr('fill', '#bdc3c7').text('→');
        }

        lg.append('text').attr('x', lx + colW / 2).attr('y', H - 30)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#27ae60').attr('font-weight', '600')
            .text('Clean boundaries — each step belongs to exactly one phase');

        lg.transition().duration(600).style('opacity', 1);

        // ── RIGHT: Anatomic Pathology (blurred) ──
        var rx = colW + gap;
        var rg = svg.append('g').style('opacity', 0);
        rg.append('text').attr('x', rx + colW / 2).attr('y', 24)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('font-weight', '700').attr('fill', '#0e6e8c')
            .text('Anatomic Pathology  ?');

        var apSteps = [
            ['Order entry', 'Collection', 'Transport'],
            ['Grossing ←→', 'Processing', 'Slide creation', 'Staining', 'Interpretation', 'Sign-out'],
            ['Reporting', 'Distribution', 'Recuts / rescans ←→', 'Follow-up']
        ];

        phaseLabels.forEach(function (label, pi) {
            var px = rx + pi * (phaseW + phaseGap) + 20;
            var h = pi === 1 ? phaseH + 20 : phaseH - 10;
            var y = pi === 1 ? 30 : 50;

            rg.append('rect').attr('x', px).attr('y', y)
                .attr('width', phaseW).attr('height', h)
                .attr('rx', 10).attr('fill', colors[pi]).attr('fill-opacity', 0.08)
                .attr('stroke', colors[pi]).attr('stroke-opacity', 0.4).attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '6,3');

            rg.append('text').attr('x', px + phaseW / 2).attr('y', y + 22)
                .attr('text-anchor', 'middle').attr('font-size', '11px')
                .attr('font-weight', '700').attr('fill', colors[pi]).text(label);

            apSteps[pi].forEach(function (step, si) {
                var isOverlap = (step.indexOf('←→') >= 0);
                rg.append('text').attr('x', px + phaseW / 2).attr('y', y + 46 + si * 22)
                    .attr('text-anchor', 'middle').attr('font-size', '11px')
                    .attr('fill', isOverlap ? '#e74c3c' : '#555')
                    .attr('font-weight', isOverlap ? '700' : '400')
                    .text(step);
            });
        });

        // Full-width BLUR overlay spanning all three AP phases
        var blurX = rx + 14;
        var blurW = 3 * phaseW + 2 * phaseGap + 12;
        rg.append('rect').attr('x', blurX).attr('y', 70)
            .attr('width', blurW).attr('height', 200).attr('rx', 10)
            .attr('fill', '#e74c3c').attr('fill-opacity', 0.04)
            .attr('stroke', '#e74c3c').attr('stroke-dasharray', '6,4')
            .attr('stroke-width', 1.5).attr('stroke-opacity', 0.5);
        rg.append('text').attr('x', blurX + blurW / 2).attr('y', 286)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#e74c3c').attr('font-weight', '700')
            .text('BOUNDARIES BLUR — activities cross phases');

        rg.append('text').attr('x', rx + colW / 2).attr('y', H - 30)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#e74c3c').attr('font-weight', '600')
            .text('Grossing, staining, recuts, rescans — all straddle phases');

        rg.transition().delay(500).duration(600).style('opacity', 1);

        // Center divider
        svg.append('line').attr('x1', colW + gap / 2).attr('x2', colW + gap / 2)
            .attr('y1', 10).attr('y2', H - 10)
            .attr('stroke', '#e0e5eb').attr('stroke-width', 1).attr('stroke-dasharray', '4,4');
    }

    // ─── CASE TIMELINE (horizontal step chain with delays) ──
    function caseTimeline(container, config) {
        var steps = (config && config.steps) || [];
        var n = steps.length;
        var W = 1060, H = 340;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Two-row layout for 13 steps
        var row1Count = Math.ceil(n / 2);
        var row2Count = n - row1Count;
        var boxW = 72, boxH = 34, gapX = 8, rowGap = 100;
        var row1Y = 40, row2Y = row1Y + rowGap;

        function boxX(col, rowCount) {
            var totalW = rowCount * boxW + (rowCount - 1) * gapX;
            var startX = (W - totalW) / 2;
            return startX + col * (boxW + gapX);
        }

        steps.forEach(function (step, i) {
            var isRow1 = i < row1Count;
            var col = isRow1 ? i : (i - row1Count);
            var rowCount = isRow1 ? row1Count : row2Count;
            var x = boxX(col, rowCount);
            var y = isRow1 ? row1Y : row2Y;

            var g = svg.append('g').style('opacity', 0);

            var isDelay = !!step.delay;
            var fillColor = isDelay ? 'rgba(231,76,60,0.12)' : 'rgba(41,128,185,0.06)';
            var strokeColor = isDelay ? '#e74c3c' : '#bdc3c7';
            var strokeW = isDelay ? 2 : 1.5;

            g.append('rect').attr('x', x).attr('y', y)
                .attr('width', boxW).attr('height', boxH)
                .attr('rx', 6).attr('fill', fillColor)
                .attr('stroke', strokeColor).attr('stroke-width', strokeW);

            g.append('text').attr('x', x + boxW / 2).attr('y', y + boxH / 2 + 4)
                .attr('text-anchor', 'middle').attr('font-size', '9px')
                .attr('font-weight', '600')
                .attr('fill', isDelay ? '#e74c3c' : '#0e6e8c')
                .text(step.label);

            // Time label below box
            if (step.minutes > 0) {
                var timeStr = step.minutes >= 60
                    ? (step.minutes / 60).toFixed(0) + 'h'
                    : step.minutes + 'm';
                g.append('text').attr('x', x + boxW / 2).attr('y', y + boxH + 14)
                    .attr('text-anchor', 'middle').attr('font-size', '8px')
                    .attr('fill', '#999').text(timeStr);
            }

            // Delay callout
            if (isDelay && step.delayNote) {
                var noteY = isRow1 ? y - 14 : y + boxH + 26;
                g.append('text').attr('x', x + boxW / 2).attr('y', noteY)
                    .attr('text-anchor', 'middle').attr('font-size', '8px')
                    .attr('fill', '#e74c3c').attr('font-weight', '600')
                    .text('⚠ ' + step.delayNote);
            }

            // Arrow to next step in same row
            var nextInRow = isRow1 ? (i + 1 < row1Count) : (i + 1 < n);
            if (nextInRow && !(isRow1 && i + 1 === row1Count)) {
                g.append('text')
                    .attr('x', x + boxW + gapX / 2).attr('y', y + boxH / 2 + 4)
                    .attr('text-anchor', 'middle').attr('font-size', '12px')
                    .attr('fill', '#bdc3c7').text('→');
            }

            g.transition().delay(i * 80).duration(300).style('opacity', 1);
        });

        // Curved arrow from end of row 1 down to start of row 2
        if (row2Count > 0) {
            var endX1 = boxX(row1Count - 1, row1Count) + boxW;
            var startX2 = boxX(0, row2Count);
            svg.append('path')
                .attr('d', 'M' + endX1 + ',' + (row1Y + boxH / 2) +
                    ' C' + (endX1 + 40) + ',' + (row1Y + boxH / 2) +
                    ' ' + (endX1 + 40) + ',' + (row2Y + boxH / 2) +
                    ' ' + (endX1) + ',' + (row2Y + boxH / 2))
                .attr('fill', 'none').attr('stroke', '#bdc3c7')
                .attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3')
                .attr('marker-end', 'none');

            // Horizontal connector to row 2 first box if needed
            if (startX2 < endX1) {
                svg.append('line')
                    .attr('x1', endX1).attr('y1', row2Y + boxH / 2)
                    .attr('x2', boxX(row2Count - 1, row2Count) + boxW + 5).attr('y2', row2Y + boxH / 2)
                    .attr('stroke', 'none');
            }
        }

        // Legend
        svg.append('rect').attr('x', 20).attr('y', H - 40).attr('width', 14).attr('height', 14)
            .attr('rx', 3).attr('fill', 'rgba(231,76,60,0.12)').attr('stroke', '#e74c3c').attr('stroke-width', 1.5);
        svg.append('text').attr('x', 40).attr('y', H - 29)
            .attr('font-size', '10px').attr('fill', '#e74c3c').attr('font-weight', '600')
            .text('Delay / breakpoint');

        svg.append('rect').attr('x', 170).attr('y', H - 40).attr('width', 14).attr('height', 14)
            .attr('rx', 3).attr('fill', 'rgba(41,128,185,0.06)').attr('stroke', '#bdc3c7').attr('stroke-width', 1.5);
        svg.append('text').attr('x', 190).attr('y', H - 29)
            .attr('font-size', '10px').attr('fill', '#888')
            .text('Normal step');
    }

    // ─── MEASUREMENT INTERVALS (relay race + error types) ────
    function measurementIntervals(container, config) {
        var steps = (config && config.steps) || [];
        var errorTypes = (config && config.errorTypes) || [];
        var W = 1060, H = 380;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // ── Top row: step chain as relay race with split times ──
        var n = steps.length;
        var boxW = 76, boxH = 30, gapX = 12;
        var totalW = n * boxW + (n - 1) * gapX;
        var startX = (W - totalW) / 2;
        var chainY = 30;

        steps.forEach(function (step, i) {
            var x = startX + i * (boxW + gapX);
            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', x).attr('y', chainY)
                .attr('width', boxW).attr('height', boxH)
                .attr('rx', 5).attr('fill', 'rgba(14,110,140,0.08)')
                .attr('stroke', '#0e6e8c').attr('stroke-width', 1.5);

            g.append('text').attr('x', x + boxW / 2).attr('y', chainY + boxH / 2 + 4)
                .attr('text-anchor', 'middle').attr('font-size', '8px')
                .attr('font-weight', '600').attr('fill', '#0e6e8c')
                .text(step);

            // Interval bracket below
            if (i < n - 1) {
                var midX = x + boxW + gapX / 2;
                g.append('text').attr('x', midX).attr('y', chainY + boxH / 2 + 4)
                    .attr('text-anchor', 'middle').attr('font-size', '11px')
                    .attr('fill', '#bdc3c7').text('→');

                // Small clock icon for measurable interval
                g.append('text').attr('x', midX).attr('y', chainY + boxH + 16)
                    .attr('text-anchor', 'middle').attr('font-size', '8px')
                    .attr('fill', '#999').text('⏱');
            }

            g.transition().delay(i * 60).duration(300).style('opacity', 1);
        });

        // ── Bottom section: error type cards ──
        var cardY = chainY + boxH + 50;
        var cardW = (W - 80) / errorTypes.length;
        var cardGap = 20;

        errorTypes.forEach(function (et, ei) {
            var cx = 20 + ei * (cardW + cardGap);
            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', cx).attr('y', cardY)
                .attr('width', cardW).attr('height', H - cardY - 20)
                .attr('rx', 10).attr('fill', et.color).attr('fill-opacity', 0.06)
                .attr('stroke', et.color).attr('stroke-opacity', 0.3).attr('stroke-width', 1.5);

            g.append('text').attr('x', cx + 14).attr('y', cardY + 26)
                .attr('font-size', '14px').attr('font-weight', '700').attr('fill', et.color)
                .text(et.icon + '  ' + et.label);

            et.items.forEach(function (item, ii) {
                g.append('text').attr('x', cx + 22).attr('y', cardY + 52 + ii * 24)
                    .attr('font-size', '12px').attr('fill', '#444')
                    .text('• ' + item);
            });

            g.transition().delay(400 + ei * 300).duration(500).style('opacity', 1);
        });

        // Connecting lines from chain to error type cards
        var lineY1 = chainY + boxH + 20;
        var lineY2 = cardY - 5;
        errorTypes.forEach(function (et, ei) {
            var cx = 20 + ei * (cardW + cardGap) + cardW / 2;
            svg.append('line').attr('x1', cx).attr('y1', lineY1)
                .attr('x2', cx).attr('y2', lineY2)
                .attr('stroke', et.color).attr('stroke-width', 1)
                .attr('stroke-dasharray', '4,3').attr('opacity', 0.4);
        });
    }

    // ─── SHARED: TOOLTIP HELPER ────────────────────────────────
    function _createTooltip(parentContainer) {
        var tip = document.createElement('div');
        tip.className = 'viz-tooltip';
        tip.style.cssText = 'position:absolute;pointer-events:none;opacity:0;transition:opacity 0.15s;' +
            'background:rgba(15,23,42,0.95);color:#e2e8f0;padding:10px 14px;border-radius:10px;' +
            'font-size:13px;line-height:1.45;max-width:260px;box-shadow:0 8px 24px rgba(0,0,0,0.3);' +
            'border:1px solid rgba(71,85,105,0.4);backdrop-filter:blur(8px);z-index:30;' +
            'font-family:Inter,Helvetica Neue,Arial,sans-serif;';
        parentContainer.style.position = 'relative';
        parentContainer.appendChild(tip);
        return tip;
    }
    function _showTooltip(tip, html, x, y) {
        tip.innerHTML = html;
        tip.style.left = x + 'px';
        tip.style.top = y + 'px';
        tip.style.opacity = '1';
    }
    function _hideTooltip(tip) { tip.style.opacity = '0'; }

    // ─── ANIMATED PIPELINE (packets flowing through stations) ─
    function animatedPipeline(container, config) {
        var W = 1060, H = 340;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Glow filter
        var defs = svg.append('defs');
        var filter = defs.append('filter').attr('id', 'pkt-glow');
        filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
        var mg = filter.append('feMerge');
        mg.append('feMergeNode').attr('in', 'blur');
        mg.append('feMergeNode').attr('in', 'SourceGraphic');

        // Grid background
        var gridP = defs.append('pattern')
            .attr('id', 'pipe-grid').attr('width', 40).attr('height', 40)
            .attr('patternUnits', 'userSpaceOnUse');
        gridP.append('path').attr('d', 'M 40 0 L 0 0 0 40')
            .attr('fill', 'none').attr('stroke', '#1e293b').attr('stroke-width', 0.8);

        svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#0f172a').attr('rx', 12);
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', 'url(#pipe-grid)');

        var stations = (config && config.stations) || [
            { id: 'gap', label: 'Workflow Gap', sub: 'Identify problem', x: 80, y: 140, w: 110, h: 56, color: '#ef4444' },
            { id: 'spec', label: 'Functional Spec', sub: 'Define requirements', x: 260, y: 140, w: 130, h: 56, color: '#f97316' },
            { id: 'build', label: 'Build / Code', sub: 'Develop solution', x: 460, y: 140, w: 110, h: 56, color: '#22c55e' },
            { id: 'test', label: 'Validate', sub: 'Clinical testing', x: 640, y: 140, w: 100, h: 56, color: '#3b82f6' },
            { id: 'deploy', label: 'Deploy', sub: 'Ship to users', x: 810, y: 140, w: 90, h: 56, color: '#8b5cf6' },
            { id: 'feedback', label: 'Feedback', sub: 'Measure & iterate', x: 960, y: 140, w: 90, h: 56, color: '#06b6d4' }
        ];

        // Draw tracks
        for (var ti = 0; ti < stations.length - 1; ti++) {
            var s1 = stations[ti], s2 = stations[ti + 1];
            svg.append('path').attr('id', 'track-' + ti)
                .attr('d', 'M' + (s1.x + s1.w) + ',' + (s1.y + s1.h / 2) +
                    ' C' + (s1.x + s1.w + 40) + ',' + (s1.y + s1.h / 2) +
                    ' ' + (s2.x - 40) + ',' + (s2.y + s2.h / 2) +
                    ' ' + s2.x + ',' + (s2.y + s2.h / 2))
                .attr('fill', 'none').attr('stroke', '#334155')
                .attr('stroke-width', 4).attr('stroke-linecap', 'round');
        }

        // Feedback loop
        var fst = stations[0], lst = stations[stations.length - 1];
        svg.append('path')
            .attr('d', 'M' + (lst.x + lst.w / 2) + ',' + lst.y +
                ' C' + (lst.x + lst.w / 2) + ',50' +
                ' ' + (fst.x + fst.w / 2) + ',50' +
                ' ' + (fst.x + fst.w / 2) + ',' + fst.y)
            .attr('fill', 'none').attr('stroke', '#f59e0b')
            .attr('stroke-width', 2).attr('stroke-dasharray', '8,5').attr('opacity', 0.5);

        svg.append('text').attr('x', W / 2).attr('y', 40)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#f59e0b').attr('font-weight', '600')
            .text('Feedback Loop \u2014 iterate based on real usage');

        // Draw stations
        stations.forEach(function (st, i) {
            var g = svg.append('g').style('opacity', 0);
            g.append('rect').attr('x', st.x).attr('y', st.y)
                .attr('width', st.w).attr('height', st.h).attr('rx', 10)
                .attr('fill', '#1e293b').attr('stroke', st.color).attr('stroke-width', 2);
            g.append('text').attr('x', st.x + st.w / 2).attr('y', st.y + 26)
                .attr('text-anchor', 'middle').attr('font-size', '13px')
                .attr('font-weight', '700').attr('fill', '#f8fafc').text(st.label);
            g.append('text').attr('x', st.x + st.w / 2).attr('y', st.y + 44)
                .attr('text-anchor', 'middle').attr('font-size', '10px')
                .attr('fill', '#94a3b8').text(st.sub);
            g.append('circle').attr('cx', st.x - 10).attr('cy', st.y + st.h / 2)
                .attr('r', 5).attr('fill', st.color)
                .style('filter', 'drop-shadow(0 0 6px ' + st.color + ')');
            g.transition().delay(i * 200).duration(400).style('opacity', 1);
        });

        // Timeline annotation below
        var roles = [
            { text: 'Domain Expert (You)', x: 170, color: '#ef4444' },
            { text: 'Developer + Clinician', x: 530, color: '#22c55e' },
            { text: 'Production', x: 900, color: '#8b5cf6' }
        ];
        roles.forEach(function (r) {
            svg.append('text').attr('x', r.x).attr('y', H - 40)
                .attr('text-anchor', 'middle').attr('font-size', '11px')
                .attr('fill', r.color).attr('font-weight', '600').text(r.text);
        });

        // Spawn animated packets
        function spawnPacket() {
            var types = [
                { label: 'FS Alert', color: '#ef4444' },
                { label: 'NGS Rpt', color: '#22c55e' },
                { label: 'QA Tool', color: '#3b82f6' },
                { label: 'Dash', color: '#f59e0b' }
            ];
            var pt = types[Math.floor(Math.random() * types.length)];
            var pkt = svg.append('g').attr('filter', 'url(#pkt-glow)');
            pkt.append('rect').attr('x', -18).attr('y', -9)
                .attr('width', 36).attr('height', 18).attr('rx', 4).attr('fill', pt.color);
            pkt.append('text').attr('y', 1).attr('text-anchor', 'middle')
                .attr('font-size', '7px').attr('font-weight', '700')
                .attr('fill', '#fff').attr('dominant-baseline', 'middle').text(pt.label);

            var idx = 0;
            function step() {
                var path = svg.select('#track-' + idx).node();
                if (!path) { pkt.transition().duration(300).style('opacity', 0).remove(); return; }
                var len = path.getTotalLength();
                var p0 = path.getPointAtLength(0);
                pkt.attr('transform', 'translate(' + p0.x + ',' + p0.y + ')');
                pkt.transition().duration(1100 + Math.random() * 400).ease(d3.easeLinear)
                    .attrTween('transform', function () {
                        return function (t) {
                            var p = path.getPointAtLength(t * len);
                            return 'translate(' + p.x + ',' + p.y + ')';
                        };
                    })
                    .on('end', function () {
                        idx++;
                        if (idx < stations.length - 1) setTimeout(step, 150 + Math.random() * 250);
                        else pkt.transition().duration(400).style('opacity', 0).remove();
                    });
            }
            step();
        }

        var sc = 0;
        function sched() {
            if (sc++ >= 12) return;
            spawnPacket();
            setTimeout(sched, 2200 + Math.random() * 1400);
        }
        setTimeout(sched, 1200);
    }

    // ─── SEVEN OPTIONS LADDER ─────────────────────────────────
    function sevenOptionsLadder(container, config) {
        var W = 1060, H = 380;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var tip = _createTooltip(container);

        var options = [
            { label: '1. Ignore the gap', sub: 'Live with it — accept the friction', color: '#8b0000', bg: '#fce4e4', icon: '🙈', zone: 'passive', tip: '<strong>Risk:</strong> Friction compounds. Every workaround is a future error. Staff burnout increases, and the gap never closes.' },
            { label: '2. Patch manually', sub: 'Workarounds, spreadsheets, sticky notes', color: '#a0522d', bg: '#faebd7', icon: '🩹', zone: 'passive', tip: '<strong>Reality:</strong> 80% of labs do this. Spreadsheets become critical infrastructure that no one maintains. One person leaves, the workaround dies.' },
            { label: '3. Switch LIS vendor', sub: 'Nuclear option — massive cost, 2-3 year project', color: '#6b4c3b', bg: '#f5ebe0', icon: '💣', zone: 'passive', tip: '<strong>Cost:</strong> $5–15M+ for a large lab. 2–3 year implementation. And the new LIS will have its own gaps.' },
            { label: '4. Request vendor fix', sub: 'Submit ticket, wait 12-18 months, hope', color: '#b8860b', bg: '#fef9e7', icon: '📋', zone: 'dependent', tip: '<strong>Challenge:</strong> Your request competes with hundreds of others. Even if approved, the vendor\u2019s generic solution may not match your specific workflow.' },
            { label: '5. Outsource development', sub: 'Hire contractors — works if spec is clear', color: '#d35400', bg: '#fdf2e9', icon: '🤝', zone: 'active', tip: '<strong>Key:</strong> Requires a clear functional specification. Without domain expertise on the contractor side, expect multiple revision cycles.' },
            { label: '6. Build it yourself', sub: 'In-house team with domain expertise', color: '#1e8449', bg: '#eafaf1', icon: '🔧', zone: 'active', tip: '<strong>Advantage:</strong> Fastest iteration, deepest domain fit. Gershkovich & Sinard showed cost-effectiveness over 4–5 years. Yale has done this for 15+ years.' },
            { label: '7. Integrate open-source', sub: 'QuPath, DSA, Slideflow — customize & deploy', color: '#1a5276', bg: '#e8f0f8', icon: '🧩', zone: 'active', tip: '<strong>Best of both:</strong> Start from production-quality code, customize for your needs. Growing ecosystem with community support.' }
        ];

        var stepH = 44, baseW = 900, narrowing = 55;

        // Zone bracket on left
        svg.append('line').attr('x1', 25).attr('x2', 25)
            .attr('y1', 14).attr('y2', H - 10)
            .attr('stroke', '#ccc').attr('stroke-width', 2.5);

        // Passive zone label
        svg.append('text').attr('x', 16).attr('y', 90)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('font-weight', '700').attr('fill', '#8b0000')
            .attr('transform', 'rotate(-90, 16, 90)')
            .text('PASSIVE');

        // Active zone label
        svg.append('text').attr('x', 16).attr('y', H - 50)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('font-weight', '700').attr('fill', '#1e8449')
            .attr('transform', 'rotate(-90, 16, ' + (H - 50) + ')')
            .text('ACTIVE');

        options.forEach(function (opt, i) {
            var w = baseW - (options.length - 1 - i) * narrowing;
            var x = 40 + (baseW - w) / 2;
            var y = 12 + i * (stepH + 4);

            var g = svg.append('g').style('opacity', 0);

            var rect = g.append('rect').attr('x', x).attr('y', y)
                .attr('width', w).attr('height', stepH)
                .attr('rx', 8).attr('fill', opt.bg)
                .attr('stroke', opt.color).attr('stroke-width', 2.5)
                .style('cursor', 'pointer')
                .style('transition', 'all 0.18s ease');

            g.append('text').attr('x', x + 40).attr('y', y + 20)
                .attr('font-size', '14px').attr('font-weight', '700')
                .attr('fill', opt.color).text(opt.label)
                .style('pointer-events', 'none');

            g.append('text').attr('x', x + 40).attr('y', y + 36)
                .attr('font-size', '11.5px').attr('fill', '#333').text(opt.sub)
                .style('pointer-events', 'none');

            g.append('text').attr('x', x + 14).attr('y', y + 30)
                .attr('font-size', '18px').text(opt.icon)
                .style('pointer-events', 'none');

            // Hover tooltip + highlight
            if (opt.tip) {
                (function (optRef, rectRef, xPos, yPos, width) {
                    rectRef.on('mouseenter', function () {
                        rectRef.attr('stroke-width', 4);
                        d3.select(this.parentNode).style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))');
                        _showTooltip(tip, optRef.tip, xPos + width + 16, yPos - 8);
                    }).on('mouseleave', function () {
                        rectRef.attr('stroke-width', 2.5);
                        d3.select(this.parentNode).style('filter', 'none');
                        _hideTooltip(tip);
                    });
                })(opt, rect, x, y, w);
            }

            g.transition().delay(i * 200).duration(400).style('opacity', 1);
        });

        // Arrow on right side
        svg.append('text').attr('x', W - 26).attr('y', H / 2 + 5)
            .attr('text-anchor', 'middle').attr('font-size', '32px')
            .attr('fill', '#1e8449').text('▲')
            .style('opacity', 0)
            .transition().delay(1600).duration(500).style('opacity', 0.8);

        svg.append('text').attr('x', W - 26).attr('y', H / 2 + 25)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#1e8449').attr('font-weight', '700')
            .text('IMPACT')
            .style('opacity', 0)
            .transition().delay(1600).duration(500).style('opacity', 0.8);
    }

    // ─── COST COMPARISON (vendor vs custom over time) ────────
    function costComparison(container, config) {
        var W = 1060, H = 340;
        var margin = { top: 36, right: 120, bottom: 44, left: 80 };
        var chartW = W - margin.left - margin.right;
        var chartH = H - margin.top - margin.bottom;

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var vendorInit = (config && config.vendorInitial) || 200;
        var vendorPct = (config && config.vendorAnnualPct) || 0.23;
        var customInit = (config && config.customInitial) || 350;
        var customPct = (config && config.customAnnualPct) || 0.05;
        var years = (config && config.years) || 10;

        // Generate data
        var vendorData = [], customData = [];
        var vendorCum = vendorInit, customCum = customInit;
        vendorData.push({ year: 0, cost: vendorInit });
        customData.push({ year: 0, cost: customInit });

        for (var yr = 1; yr <= years; yr++) {
            vendorCum += vendorInit * vendorPct;
            customCum += customInit * customPct;
            vendorData.push({ year: yr, cost: vendorCum });
            customData.push({ year: yr, cost: customCum });
        }

        var maxCost = Math.max(vendorData[years].cost, customData[years].cost);

        var xScale = d3.scaleLinear().domain([0, years]).range([0, chartW]);
        var yScale = d3.scaleLinear().domain([0, maxCost * 1.1]).range([chartH, 0]);

        // Axes
        var xAxis = d3.axisBottom(xScale).ticks(years).tickFormat(function (d) { return 'Yr ' + d; });
        var yAxis = d3.axisLeft(yScale).ticks(6).tickFormat(function (d) { return '$' + d + 'K'; });

        g.append('g').attr('transform', 'translate(0,' + chartH + ')')
            .call(xAxis)
            .selectAll('text').attr('font-size', '12px').attr('fill', '#333').attr('font-weight', '500');

        g.append('g').call(yAxis)
            .selectAll('text').attr('font-size', '12px').attr('fill', '#333').attr('font-weight', '500');

        // Grid lines
        g.selectAll('.grid-line')
            .data(yScale.ticks(6)).enter()
            .append('line')
            .attr('x1', 0).attr('x2', chartW)
            .attr('y1', function (d) { return yScale(d); })
            .attr('y2', function (d) { return yScale(d); })
            .attr('stroke', '#ccc').attr('stroke-width', 1);

        // Vendor line
        var vendorLine = d3.line()
            .x(function (d) { return xScale(d.year); })
            .y(function (d) { return yScale(d.cost); });

        var customLine = d3.line()
            .x(function (d) { return xScale(d.year); })
            .y(function (d) { return yScale(d.cost); });

        // Find crossover point
        var crossYear = -1;
        for (var ci = 1; ci <= years; ci++) {
            if (vendorData[ci].cost >= customData[ci].cost && vendorData[ci - 1].cost < customData[ci - 1].cost) {
                crossYear = ci;
                break;
            }
        }
        // If vendor starts lower
        if (vendorData[0].cost < customData[0].cost) {
            for (var ci2 = 1; ci2 <= years; ci2++) {
                if (vendorData[ci2].cost >= customData[ci2].cost) {
                    crossYear = ci2;
                    break;
                }
            }
        }

        // Breakeven annotation
        if (crossYear > 0) {
            var bx = xScale(crossYear);
            var by = yScale(vendorData[crossYear].cost);
            g.append('line').attr('x1', bx).attr('x2', bx)
                .attr('y1', 0).attr('y2', chartH)
                .attr('stroke', '#e74c3c').attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '6,4').attr('opacity', 0.6);

            g.append('text').attr('x', bx + 8).attr('y', 16)
                .attr('font-size', '11px').attr('fill', '#e74c3c')
                .attr('font-weight', '700')
                .text('Breakeven ~Year ' + crossYear);
        }

        // Shade the savings area after breakeven
        if (crossYear > 0) {
            var areaData = [];
            for (var ai = crossYear; ai <= years; ai++) {
                areaData.push({
                    year: ai,
                    vendorCost: vendorData[ai].cost,
                    customCost: customData[ai].cost
                });
            }
            var area = d3.area()
                .x(function (d) { return xScale(d.year); })
                .y0(function (d) { return yScale(d.customCost); })
                .y1(function (d) { return yScale(d.vendorCost); });

            g.append('path').datum(areaData)
                .attr('d', area)
                .attr('fill', '#27ae60').attr('fill-opacity', 0.2)
                .style('opacity', 0)
                .transition().delay(2000).duration(600).style('opacity', 1);

            // Savings label
            var savingsYear = years;
            var savings = vendorData[savingsYear].cost - customData[savingsYear].cost;
            g.append('text')
                .attr('x', xScale((crossYear + years) / 2))
                .attr('y', yScale((vendorData[savingsYear].cost + customData[savingsYear].cost) / 2) + 5)
                .attr('text-anchor', 'middle').attr('font-size', '12px')
                .attr('fill', '#27ae60').attr('font-weight', '700')
                .text('$' + Math.round(savings) + 'K saved')
                .style('opacity', 0)
                .transition().delay(2400).duration(500).style('opacity', 1);
        }

        // Draw vendor line with animation
        var vendorPath = g.append('path').datum(vendorData)
            .attr('d', vendorLine)
            .attr('fill', 'none').attr('stroke', '#e74c3c')
            .attr('stroke-width', 3);
        var vendorLen = vendorPath.node().getTotalLength();
        vendorPath.attr('stroke-dasharray', vendorLen)
            .attr('stroke-dashoffset', vendorLen)
            .transition().duration(1500).attr('stroke-dashoffset', 0);

        // Draw custom line with animation
        var customPath = g.append('path').datum(customData)
            .attr('d', customLine)
            .attr('fill', 'none').attr('stroke', '#27ae60')
            .attr('stroke-width', 3);
        var customLen = customPath.node().getTotalLength();
        customPath.attr('stroke-dasharray', customLen)
            .attr('stroke-dashoffset', customLen)
            .transition().duration(1500).attr('stroke-dashoffset', 0);

        // Interactive data point dots with hover
        var costTip = _createTooltip(container);

        vendorData.forEach(function (d) {
            g.append('circle')
                .attr('cx', xScale(d.year)).attr('cy', yScale(d.cost))
                .attr('r', 5).attr('fill', '#e74c3c').attr('stroke', '#fff').attr('stroke-width', 1.5)
                .style('cursor', 'pointer').style('opacity', 0)
                .transition().delay(1500 + d.year * 100).duration(300).style('opacity', 1);
        });
        customData.forEach(function (d) {
            g.append('circle')
                .attr('cx', xScale(d.year)).attr('cy', yScale(d.cost))
                .attr('r', 5).attr('fill', '#27ae60').attr('stroke', '#fff').attr('stroke-width', 1.5)
                .style('cursor', 'pointer').style('opacity', 0)
                .transition().delay(1500 + d.year * 100).duration(300).style('opacity', 1);
        });

        // Overlay transparent rect for mouse tracking
        g.append('rect').attr('width', chartW).attr('height', chartH)
            .attr('fill', 'transparent').style('cursor', 'crosshair')
            .on('mousemove', function (event) {
                var coords = d3.pointer(event);
                var yr = Math.round(xScale.invert(coords[0]));
                if (yr >= 0 && yr <= years) {
                    var vCost = vendorData[yr].cost;
                    var cCost = customData[yr].cost;
                    var diff = vCost - cCost;
                    var diffLabel = diff >= 0
                        ? '<span style="color:#27ae60">Custom saves $' + Math.round(Math.abs(diff)) + 'K</span>'
                        : '<span style="color:#e74c3c">Custom costs $' + Math.round(Math.abs(diff)) + 'K more</span>';
                    _showTooltip(costTip,
                        '<strong>Year ' + yr + '</strong><br>' +
                        '<span style="color:#e74c3c">Vendor: $' + Math.round(vCost) + 'K</span><br>' +
                        '<span style="color:#27ae60">Custom: $' + Math.round(cCost) + 'K</span><br>' +
                        diffLabel,
                        coords[0] + margin.left + 14, coords[1] + margin.top - 20);
                }
            })
            .on('mouseleave', function () { _hideTooltip(costTip); });

        // Legend
        var legend = svg.append('g')
            .attr('transform', 'translate(' + (W - 110) + ',' + (margin.top + 20) + ')');

        legend.append('line').attr('x1', 0).attr('x2', 24).attr('y1', 0).attr('y2', 0)
            .attr('stroke', '#e74c3c').attr('stroke-width', 3);
        legend.append('text').attr('x', 30).attr('y', 4)
            .attr('font-size', '12px').attr('fill', '#e74c3c').text('Vendor');

        legend.append('line').attr('x1', 0).attr('x2', 24).attr('y1', 22).attr('y2', 22)
            .attr('stroke', '#27ae60').attr('stroke-width', 3);
        legend.append('text').attr('x', 30).attr('y', 26)
            .attr('font-size', '12px').attr('fill', '#27ae60').text('Custom');

        // Axis labels
        svg.append('text')
            .attr('x', margin.left + chartW / 2).attr('y', H - 6)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#333').attr('font-weight', '600').text('Years after initial investment');

        svg.append('text')
            .attr('x', 16).attr('y', margin.top + chartH / 2)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#333').attr('font-weight', '600')
            .attr('transform', 'rotate(-90, 16, ' + (margin.top + chartH / 2) + ')')
            .text('Cumulative Cost ($K)');
    }

    // ─── TECH STACK PYRAMID ──────────────────────────────────
    function techStackPyramid(container, config) {
        var W = 1060, H = 380;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var tip = _createTooltip(container);

        var layers = [
            { label: 'Clinical Requirements & Specifications', sub: 'What does the tool need to do? (YOU write this)', color: '#c0392b', bg: '#fdecea', role: '← Pathologist-driven', icon: '🩺', tip: '<strong>Your most impactful contribution.</strong> Define what the tool must do, who uses it, and what "correct" looks like. No code required.' },
            { label: 'User Interface (UI)', sub: 'HTML, CSS, React — what users see and interact with', color: '#d35400', bg: '#fdf2e9', role: '← Design + clinical input', icon: '🖥️', tip: '<strong>Where usability lives.</strong> Pathologists shape the interface — button placement, workflow order, what information appears where.' },
            { label: 'Application Logic', sub: 'Python, JavaScript, Java — business rules, algorithms', color: '#b7950b', bg: '#fef9e7', role: '← Developer + domain expert', icon: '⚙️', tip: '<strong>The engine.</strong> Business rules translated to code. Domain expert reviews ensure the logic matches clinical reality.' },
            { label: 'APIs & Integration', sub: 'REST, HL7 FHIR, DICOM — connecting systems', color: '#1e8449', bg: '#eafaf1', role: '← Developer', icon: '🔗', tip: '<strong>System glue.</strong> Connects your tool to the LIS, image servers, and external databases.' },
            { label: 'Data & Storage', sub: 'PostgreSQL, MongoDB — where data lives', color: '#1a5276', bg: '#e8f0f8', role: '← Developer + DBA', icon: '🗄️', tip: '<strong>Foundation.</strong> How data is structured, stored, and retrieved. Gets the schema right or nothing else works.' },
            { label: 'Infrastructure', sub: 'Servers, Docker, Cloud, Networks — the plumbing', color: '#6c3483', bg: '#f4ecf7', role: '← IT / DevOps', icon: '🏗️', tip: '<strong>The plumbing.</strong> Servers, containers, networking. Usually handled by IT, not pathologists.' }
        ];

        var stepH = 50, baseW = 920, narrowing = 70;

        // "You are here" bracket around top 2 layers
        var bracketTop = 6;
        var bracketH = 2 * stepH + 18;
        svg.append('rect').attr('x', 28).attr('y', bracketTop)
            .attr('width', W - 56).attr('height', bracketH)
            .attr('rx', 12).attr('fill', 'rgba(192,57,43,0.06)')
            .attr('stroke', '#c0392b').attr('stroke-dasharray', '6,4')
            .attr('stroke-width', 2.5);

        svg.append('text').attr('x', W - 46).attr('y', bracketTop + bracketH / 2 + 5)
            .attr('text-anchor', 'end').attr('font-size', '13px')
            .attr('fill', '#c0392b').attr('font-weight', '700')
            .text('▲ YOUR HIGHEST IMPACT ZONE');

        layers.forEach(function (layer, i) {
            var w = baseW - i * narrowing;
            var x = (W - w) / 2;
            var y = 14 + i * (stepH + 5);

            var g = svg.append('g').style('opacity', 0);

            var rect = g.append('rect').attr('x', x).attr('y', y)
                .attr('width', w).attr('height', stepH)
                .attr('rx', 8).attr('fill', layer.bg)
                .attr('stroke', layer.color).attr('stroke-width', 2.5)
                .style('cursor', 'pointer')
                .style('transition', 'all 0.18s ease');

            g.append('text').attr('x', x + 42).attr('y', y + 22)
                .attr('font-size', '15px').attr('font-weight', '700')
                .attr('fill', layer.color).text(layer.label)
                .style('pointer-events', 'none');

            g.append('text').attr('x', x + 42).attr('y', y + 40)
                .attr('font-size', '12px').attr('fill', '#333').text(layer.sub)
                .style('pointer-events', 'none');

            g.append('text').attr('x', x + 14).attr('y', y + 32)
                .attr('font-size', '18px').text(layer.icon)
                .style('pointer-events', 'none');

            // Role annotation on right
            g.append('text').attr('x', x + w + 14).attr('y', y + 32)
                .attr('font-size', '12px').attr('fill', layer.color)
                .attr('font-weight', '700').text(layer.role)
                .style('pointer-events', 'none');

            // Hover tooltip + highlight
            (function (layerRef, rectRef, xPos, yPos, width) {
                rectRef.on('mouseenter', function () {
                    rectRef.attr('stroke-width', 4);
                    d3.select(this.parentNode).style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))');
                    _showTooltip(tip, layerRef.tip, xPos + width / 2, yPos - 12);
                }).on('mouseleave', function () {
                    rectRef.attr('stroke-width', 2.5);
                    d3.select(this.parentNode).style('filter', 'none');
                    _hideTooltip(tip);
                });
            })(layer, rect, x, y, w);

            // All layers fully visible — no fading lower layers
            g.transition().delay(i * 250).duration(450).style('opacity', 1);
        });
    }

    // ─── DEV LIFECYCLE LOOP ──────────────────────────────────
    function devLifecycleLoop(container, config) {
        var W = 1060, H = 400;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var cx = W / 2, cy = H / 2 + 10, radius = 150;

        var steps = [
            { label: 'Identify Gap', sub: 'Observe workflow friction', color: '#c0392b', bg: '#fdecea', icon: '🔍' },
            { label: 'Specify', sub: 'Write functional spec', color: '#d35400', bg: '#fdf2e9', icon: '📋' },
            { label: 'Design', sub: 'Architecture & UX', color: '#b7950b', bg: '#fef9e7', icon: '✏️' },
            { label: 'Build', sub: 'Code & integrate', color: '#1e8449', bg: '#eafaf1', icon: '🔧' },
            { label: 'Test', sub: 'Validate clinically', color: '#1a5276', bg: '#e8f0f8', icon: '🧪' },
            { label: 'Deploy', sub: 'Ship to production', color: '#6c3483', bg: '#f4ecf7', icon: '🚀' },
            { label: 'Feedback', sub: 'Measure & iterate', color: '#0e6e5c', bg: '#e8f8f5', icon: '📊' }
        ];

        var n = steps.length;

        // Center label
        svg.append('text').attr('x', cx).attr('y', cy - 12)
            .attr('text-anchor', 'middle').attr('font-size', '18px')
            .attr('font-weight', '700').attr('fill', '#1a2e44')
            .text('Iterative');
        svg.append('text').attr('x', cx).attr('y', cy + 10)
            .attr('text-anchor', 'middle').attr('font-size', '18px')
            .attr('font-weight', '700').attr('fill', '#1a2e44')
            .text('Development');
        svg.append('text').attr('x', cx).attr('y', cy + 32)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#555').attr('font-weight', '600')
            .text('(not waterfall)');

        // Draw connecting arcs — bolder arrows
        steps.forEach(function (step, i) {
            var angle = (i / n) * 2 * Math.PI - Math.PI / 2;
            var nextAngle = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;

            var midAngle = (angle + nextAngle) / 2;
            var arrowR = radius - 2;
            var ax = cx + arrowR * Math.cos(midAngle);
            var ay = cy + arrowR * Math.sin(midAngle);

            svg.append('text').attr('x', ax).attr('y', ay + 4)
                .attr('text-anchor', 'middle').attr('font-size', '18px')
                .attr('fill', '#888')
                .attr('transform', 'rotate(' + (midAngle * 180 / Math.PI + 90) + ',' + ax + ',' + ay + ')')
                .text('▸')
                .style('opacity', 0)
                .transition().delay(n * 200 + i * 100).duration(300).style('opacity', 0.7);
        });

        // Draw nodes
        steps.forEach(function (step, i) {
            var angle = (i / n) * 2 * Math.PI - Math.PI / 2;
            var nx = cx + radius * Math.cos(angle);
            var ny = cy + radius * Math.sin(angle);

            var nodeG = svg.append('g')
                .attr('transform', 'translate(' + nx + ',' + ny + ')')
                .style('opacity', 0);

            nodeG.append('circle').attr('r', 44)
                .attr('fill', step.bg)
                .attr('stroke', step.color).attr('stroke-width', 3);

            nodeG.append('text').attr('y', -10)
                .attr('text-anchor', 'middle').attr('font-size', '20px')
                .text(step.icon);

            nodeG.append('text').attr('y', 10)
                .attr('text-anchor', 'middle').attr('font-size', '12px')
                .attr('font-weight', '700').attr('fill', step.color)
                .text(step.label);

            nodeG.append('text').attr('y', 24)
                .attr('text-anchor', 'middle').attr('font-size', '9px')
                .attr('fill', '#333').attr('font-weight', '500').text(step.sub);

            nodeG.transition().delay(i * 200).duration(400).style('opacity', 1);
        });

        // "Security & Compliance" ring — bolder
        svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', radius + 52)
            .attr('fill', 'none').attr('stroke', '#c0392b')
            .attr('stroke-width', 2.5).attr('stroke-dasharray', '8,6')
            .attr('opacity', 0.5);

        svg.append('text').attr('x', cx).attr('y', cy - radius - 60)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#c0392b').attr('font-weight', '700')
            .text('🛡️  SECURITY & COMPLIANCE BAKED INTO EVERY STEP');
    }

    // ─── REGISTRY (map name → function) ──────────────────────
    var registry = {
        'workflow-pipeline': workflowPipeline,
        'abstraction-layers': abstractionLayers,
        'systems-ecosystem': systemsEcosystem,
        'ai-maturity-ladder': aiMaturityLadder,
        'data-flow': dataFlow,
        'automation-ladder': automationLadder,
        'phase-comparison': phaseComparison,
        'case-timeline': caseTimeline,
        'measurement-intervals': measurementIntervals,
        'animated-pipeline': animatedPipeline,
        'seven-options-ladder': sevenOptionsLadder,
        'cost-comparison': costComparison,
        'tech-stack-pyramid': techStackPyramid,
        'dev-lifecycle-loop': devLifecycleLoop
    };

    function render(name, container, config) {
        var fn = registry[name];
        if (fn) fn(container, config || {});
        else console.warn('VizLibrary: unknown visualization "' + name + '"');
    }

    return { render: render, registry: registry };
})();
